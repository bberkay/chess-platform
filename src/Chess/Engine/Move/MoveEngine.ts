import {Color, Moves, MoveType, PieceType, Square} from "../../Types";
import {MoveRoute, Piece, Route} from "../Types";
import {BoardQueryer} from "../Board/BoardQueryer.ts";
import {Locator} from "./Utils/Locator.ts";
import {RouteCalculator} from "./Calculator/RouteCalculator.ts";
import {Extractor} from "./Utils/Extractor.ts";
import {MoveExtender} from "./Helper/MoveExtender.ts";
import {MoveFilterer} from "./Helper/MoveFilterer.ts";

/**
 * This class calculates the possible moves of the pieces.
 */
export class MoveEngine{

    /**
     * Properties of the MoveEngine class.
     */
    private readonly moveFilterer: MoveFilterer;
    private readonly moveExtender: MoveExtender;
    private piece: Piece | null = null;
    private pieceSquare: Square | null = null;

    /**
     * Constructor of the MoveEngine class.
     */
    constructor() {
        this.moveFilterer = new MoveFilterer();
        this.moveExtender = new MoveExtender();
    }
    
    /**
     * Get the possible moves of the piece on the given square.
     */
    public getMoves(square: Square): Moves | null
    {
        /**
         * Check the given moves. If there is no move, then return null
         * otherwise return the given moves.
         */
        function hasAnyMove(moves: Moves | null): Moves | null
        {
            if(!moves) return null;

            // Check every move type.
            for(const moveType in moves)
            {
                if(moves[moveType as MoveType]!.length > 0)
                    return moves;
            }

            return null;
        }
        
        // Get the piece on the given square.
        this.piece = BoardQueryer.getPieceOnSquare(square);
        this.pieceSquare = square;

        // If there is no piece on the given square, return null;
        if(!this.piece) return null;

        /**
         * If there is a piece on the given square, get
         * the possible moves of the piece by its type.
         */
        switch(this.piece.getType()){
            case PieceType.Pawn:
                return hasAnyMove(this.getPawnMoves());
            case PieceType.Knight:
                return hasAnyMove(this.getKnightMoves());
            case PieceType.Bishop:
                return hasAnyMove(this.getBishopMoves());
            case PieceType.Rook:
                return hasAnyMove(this.getRookMoves());
            case PieceType.Queen:
                return hasAnyMove(this.getQueenMoves());
            case PieceType.King:
                return hasAnyMove(this.getKingMoves());
            default:
                return null;
        }
    }

    /**
     * Get the possible moves of the pawn on the given square.
     */
    private getPawnMoves(): Moves | null
    {
        // Initialize the moves of the pawn.
        let moves: Moves = {[MoveType.Normal]: [], [MoveType.EnPassant]: [], [MoveType.Promotion]: []};

        // Find possible moves of the pawn.
        const route: Route = RouteCalculator.getPawnRoute(this.pieceSquare!);
        if(!route) return null;

        /**************************************************************************
         * Filter the moves of the pawn by the pawn's color, position
         * and has enemy status of the diagonal squares(these filter operations
         * made because pawn has different move capabilities by its color and position
         * also has a special move called en passant).
         *
         * @see for more information about pawn moves https://en.wikipedia.org/wiki/Pawn_(chess)
         **************************************************************************/

        // Find the pawn's color and enemy's color by the given square.
        const color: Color = this.piece!.getColor();
        const enemyColor: Color = color === Color.White ? Color.Black : Color.White;

        /**
         * Find routes of the pawn by its color. For example,
         * if the pawn is white, we need to get the top route of the pawn.
         * if the pawn is black, we need to get the bottom route of the pawn.
         */
        const moveDirection: Record<string, MoveRoute> = color === Color.White
            ? {vertical: MoveRoute.Top, leftDiagonal: MoveRoute.TopLeft, rightDiagonal: MoveRoute.TopRight}
            : {vertical: MoveRoute.Bottom, leftDiagonal: MoveRoute.BottomLeft, rightDiagonal: MoveRoute.BottomRight};

        /**
         * Filter the route by the pawn's color. For example,
         * if the pawn is white, we need to delete the bottom route of the pawn.
         * if the pawn is black, we need to delete the top route of the pawn.
         */
        for(let path in route){
            if(path != moveDirection.vertical && path != moveDirection.leftDiagonal && path != moveDirection.rightDiagonal)
                delete route[path as MoveRoute];
        }

        /**
         * Filter second square(first move of pawn) of the vertical route by
         * the checking the pawn's color and position(row).
         */
        if(Locator.getRow(this.pieceSquare!) != (color == Color.White ? 7 : 2))
            route[moveDirection.vertical]!.splice(1, 1);

        /**
         * Filter diagonal routes by the pawn's color and has enemy status.
         *
         * If the diagonal squares has no enemy piece, then remove
         * the diagonal routes from the moves.
         */
        if(!BoardQueryer.isSquareHasPiece(route[moveDirection.leftDiagonal]![0], enemyColor))
            delete route[moveDirection.leftDiagonal];

        if(!BoardQueryer.isSquareHasPiece(route[moveDirection.rightDiagonal]![0], enemyColor))
            delete route[moveDirection.rightDiagonal];

        // Add normal moves to the pawn's moves.
        moves[MoveType.Normal] = Extractor.extractSquares(this.moveFilterer.filterForKingSafety(this.pieceSquare!, this.piece!.getColor(), route)!);

        /**
         * Clear the pawn's routes. Because we will add en passant moves
         * to the pawn's moves. If we don't clear the pawn's routes, then
         * the pawn's moves will be duplicated for every move type. For example,
         * if the pawn has 2 normal moves, 1 en passant move and 1 promotion move,
         * then the pawn's moves will be 2 normal moves, 3 en passant moves(2 normal
         * + 1 en passant) and 4 promotion moves(2 normal + 1 en passant + 1 promotion).
         */
        for(let path in route) route[path as MoveRoute] = [];
        route[moveDirection.leftDiagonal] = [];
        route[moveDirection.rightDiagonal] = [];

        /**
         * Add en passant capability to the pawn. For example,
         * if the pawn is white and left en passant is available,
         * then add the left top square(current square id - 9) to the pawn's
         * moves. Also, if right en passant is available, then add the right
         * top square(current square id - 7) to the pawn's moves. For black
         * pawn, add the left bottom square(current square id + 7) and right
         * bottom square(current square id + 9) to the pawn's moves.
         *
         * @see for more information about square id check Square enum in src/Chess/Types/index.ts
         * @see for more information about en passant check src/Chess/Engine/Move/Helper/MoveExtender.ts
         */

        // Add left en passant move to the pawn's moves.
        const leftEnPassant: Square | null = this.moveExtender.getLeftEnPassantMove(this.pieceSquare!);
        if(leftEnPassant)
            route[moveDirection.leftDiagonal]!.push(leftEnPassant);

        // Add right en passant move to the pawn's moves.
        const rightEnPassant: Square | null = this.moveExtender.getRightEnPassantMove(this.pieceSquare!);
        if(rightEnPassant)
            route[moveDirection.rightDiagonal]!.push(rightEnPassant);

        // Add filtered(for king's safety) en passant moves to the pawn's moves.
        moves[MoveType.EnPassant] = Extractor.extractSquares(this.moveFilterer.filterForKingSafety(this.pieceSquare!, this.piece!.getColor(), route)!);

        /**
         * Clear the pawn's routes. Because we will add promotion moves
         * to the pawn's moves. For more information check the en passant
         * section above.
         */
        for(let path in route) route[path as MoveRoute] = [];
        route[moveDirection.vertical] = [];

        /**
         * Add promotion capability to the pawn. For example,
         * if the pawn is white and is on the seventh row,
         * then add the top square(current square id + 8) to the pawn's
         * moves. Also, if the pawn is black and is on the second row,
         * then add the bottom square(current square id - 8) to the pawn's moves.
         *
         * @see for more information about square id check Square enum in src/Chess/Types/index.ts
         * @see for more information about promotion check src/Chess/Engine/Move/Helper/MoveExtender.ts
         */

        /**
         * Delete given move from normal moves.
         */
        function deleteMoveFromNormalMoves(move: Square){
            if(moves[MoveType.Normal]!.includes(move))
                moves[MoveType.Normal]!.splice(moves[MoveType.Normal]!.indexOf(move), 1);
        }

        // Add promotion moves to the pawn's moves.
        const promotionMoves: Square[] | null = this.moveExtender.getPromotionMove(this.pieceSquare!);
        if(promotionMoves){
            route[moveDirection.vertical]!.push(promotionMoves[0]);

            // Delete vertical diagonal  from the normal moves.
            deleteMoveFromNormalMoves(route[moveDirection.vertical]![0]);

            // Add diagonal(capture move) promotion moves to the pawn's moves.
            if(promotionMoves[1]){
                route[moveDirection.leftDiagonal]!.push(promotionMoves[1]);

                // Delete left diagonal move from the normal moves.
                deleteMoveFromNormalMoves(route[moveDirection.leftDiagonal]![0]);
            }
            if(promotionMoves[2]){
                route[moveDirection.rightDiagonal]!.push(promotionMoves[2]);

                // Delete right diagonal move from the normal moves.
                deleteMoveFromNormalMoves(route[moveDirection.rightDiagonal]![0]);
            }
        }

        // Add filtered(for king's safety) promotion moves to the pawn's moves.
        moves[MoveType.Promotion] = Extractor.extractSquares(this.moveFilterer.filterForKingSafety(this.pieceSquare!, this.piece!.getColor(), route)!);

        // Return the moves of the pawn.
        return moves;
    }

    /**
     * Get the possible moves of the knight on the given square.
     */
    private getKnightMoves(): Moves | null
    {
        // Find moves of the knight.
        let route: Route = RouteCalculator.getKnightRoute(this.pieceSquare!);
        if(!route) return null;

        // Filter the moves for king safety and convert the route to squares array.
        return {[MoveType.Normal]: Extractor.extractSquares(this.moveFilterer.filterForKingSafety(this.pieceSquare!, this.piece!.getColor(), route))};
    }

    /**
     * Get the possible moves of the bishop on the given square.
     */
    private getBishopMoves(): Moves | null
    {
        // Find moves of the bishop.
        let route: Route = RouteCalculator.getBishopRoute(this.pieceSquare!);
        if(!route) return null;

        // Filter the moves for king safety and convert the route to squares array.
        return {[MoveType.Normal]: Extractor.extractSquares(this.moveFilterer.filterForKingSafety(this.pieceSquare!, this.piece!.getColor(), route))};
    }

    /**
     * Get the possible moves of the rook on the given square.
     */
    private getRookMoves(): Moves | null
    {
        // Find moves of the rook.
        let route: Route = RouteCalculator.getRookRoute(this.pieceSquare!);
        if(!route) return null;

        // Filter the moves for king safety and convert the route to squares array.
        return {[MoveType.Normal]: Extractor.extractSquares(this.moveFilterer.filterForKingSafety(this.pieceSquare!, this.piece!.getColor(), route))};
    }

    /**
     * Get the possible moves of the queen on the given square.
     */
    private getQueenMoves(): Moves | null
    {
        // Find moves of the queen.
        let route: Route = RouteCalculator.getQueenRoute(this.pieceSquare!);
        if(!route) return null;

        // Filter the moves for king safety and convert the route to squares array.
        return {[MoveType.Normal]: Extractor.extractSquares(this.moveFilterer.filterForKingSafety(this.pieceSquare!, this.piece!.getColor(), route))};
    }

    /**
     * Get the possible moves of the king on the given square.
     */
    private getKingMoves(): Moves | null
    {
        let moves: Moves = {[MoveType.Normal]: [], [MoveType.Castling]: []};

        // Get the king's route.
        let route: Route = RouteCalculator.getKingRoute(this.pieceSquare!);
        if(!route) return null;

        // Find the king's color
        const color: Color = BoardQueryer.getPieceOnSquare(this.pieceSquare!)!.getColor();

        /**
         * Remove squares that are threatened by the enemy pieces so that
         * the king can't move to the threatened squares. For example,
         * if the king is on f3 and enemy's bishop is on e6, then remove
         * g4 from the king's route because g4 is threatened by the enemy's
         * bishop currently.
         */
        for(const square of Extractor.extractSquares(route))
        {
            if(!BoardQueryer.isSquareThreatened(square, color == Color.White ? Color.Black : Color.White))
                moves[MoveType.Normal]!.push(square);
        }

        /**
         * Example: King is on f3 and enemy's bishop is on d5.
         * Currently, g2 isn't threatened by the enemy's bishop. But king can't
         * move to the g2 because after the king's move, g2 will be threatened
         * by the enemy's bishop again. This code block prevents this situation.
         */
        const enemies: boolean | Square[] = BoardQueryer.isSquareThreatened(this.pieceSquare!, color == Color.White ? Color.Black : Color.White, true);
        if(moves[MoveType.Normal]!.length > 0 && enemies){
            for(const enemySquare of enemies as Square[])
            {
                if(BoardQueryer.getPieceOnSquare(enemySquare)!.getType() == PieceType.Knight)
                    continue;

                const dangerousRoute: MoveRoute | null = Locator.getRelative(this.pieceSquare!, enemySquare);
                if(!dangerousRoute) continue;

                const dangerousMoveIndex: number = moves[MoveType.Normal]!.indexOf(route[dangerousRoute!]![0]);
                if(dangerousRoute && route.hasOwnProperty(dangerousRoute) && route[dangerousRoute]!.length > 0 && dangerousMoveIndex != -1)
                    moves[MoveType.Normal]!.splice(dangerousMoveIndex, 1);
            }
        }


        /**
         * Add castling moves to the king's moves. For example,
         * If the king is white, add Square.a1 to king's left route
         * and Square.h1 to king's right route. If the king is black,
         * add Square.a8 to king's left route and Square.h8 to king's
         * right route.
         *
         * @see for more information src/Chess/Engine/Move/Helper/MoveExtender.ts
         */

        /**
         * Clear the king's routes. Because we will add castling moves
         * to the king's moves. If we don't clear the king's routes,
         * then king's normal moves also will be added to the king's
         * castling moves. For example, if the king has 2 normal moves
         * and 2 castling moves, then normal moves will be [Square.x1, Square.x2],
         * castling moves will be [Square.a1, Square.h1, Square.x1, Square.x2].
         */
        for(let path in route) route[path as MoveRoute] = [];

        // Add long castling move to the king's moves.
        const longCastling: Square | null = this.moveExtender.getLongCastlingMove(color);
        if(longCastling)
            route[MoveRoute.Left]!.push(longCastling);

        // Add short castling move to the king's moves.
        const shortCastling: Square | null = this.moveExtender.getShortCastlingMove(color);
        if(shortCastling)
            route[MoveRoute.Right]!.push(shortCastling);

        // Get castling moves of the king. Also, castling doesn't need king safety filter because it is already filtered.
        moves[MoveType.Castling] = Extractor.extractSquares(route);

        return moves;
    }
}












