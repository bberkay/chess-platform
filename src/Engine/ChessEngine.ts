/**
 * @module ChessEngine
 * @description This module provides users to create and manage a game(does not include board or other ui elements).
 * @version 1.0.0
 * @author Berkay Kaya
 * @url https://github.com/bberkay/chess
 */

import { PieceFactory } from "./Factory/PieceFactory";
import { Converter } from "../Utils/Converter";
import { BoardManager } from "../Managers/BoardManager";
import { RouteCalculator } from "./Calculator/RouteCalculator.ts";

export class ChessEngine{

    /**
     * This calculator is used to calculate the possible routes of the pieces.
     */
    private routeCalculator: RouteCalculator;

    /**
     * Constructor of the ChessEngine class.
     * @param isStandalone If this parameter is true, the engine will work standalone. Otherwise, it will work with the Chess class.
     */
    constructor(isStandalone: boolean = true){
        console.log("isStandalone: " + isStandalone);
        this.routeCalculator = new RouteCalculator();
    }

    /**
     * This function creates a new game with the given position(fen notation or json notation).
     * @example createGame(StartPosition.Standard);
     * @example createGame("rnbqkbnr/pppd/8/8/8/8/PPPPPPPP/RNBQKBNR");
     * @example createGame([{"color":Color.White, "type":PieceType.Pawn, "square":Square.a2}, {"color":Color.White, "type":PieceType.Pawn, "square":Square.b2}, ...]);
     */
    public createGame(position: Array<{color: Color, type:PieceType, square:Square}> | StartPosition | string = StartPosition.Standard): void
    {
        // Set the game position.
        if(!Array.isArray(position)) // If fen notation is given
            position = Converter.convertFENToJSON(position as StartPosition);

        // Create the game.
        PieceFactory.createPieces(position);
    }

    /**
     * This function returns the possible moves of the given square.
     */
    public getMoves(square: Square): Array<Square> | null
    {
        // Get the piece on the given square.
        let piece: Piece | null = BoardManager.getPiece(square);
        if(!piece) return null; // If there is no piece on the given square, return null;

        // Get the possible moves of the piece by its type.
        switch(piece.getType()){
            case PieceType.Pawn:
                return this.getPawnMoves(square, piece);
            case PieceType.Knight:
                return this.getKnightMoves(square);
            case PieceType.Bishop:
                return this.getBishopMoves(square);
            case PieceType.Rook:
                return this.getRookMoves(square);
            case PieceType.Queen:
                return this.getQueenMoves(square);
            case PieceType.King:
                return this.getKingMoves(square);
            default:
                return null;
        }
    }

    /**
     * This function plays the given move.
     * @param from
     * @param to
     */
    public playMove(from: Square, to: Square): void
    {
        // BoardManager.
    }

    /**
     * Get the possible moves of the pawn on the given square.
     */
    private getPawnMoves(square: Square, pawn: Piece): Array<Square> | null
    {
        let squares: Array<Square> = [];

        // Find the enemy color by the pawn's color.
        const enemyColor: Color = pawn.getColor() == Color.White ? Color.Black : Color.White;

        // Find possible moves of the pawn.
        let route: Path = this.routeCalculator.getPawnRoute(square);
        if(!route) return null;

        // Filter pawn's moves by its color and add them to the moveRoutes array.
        const moveRoutes: Array<MoveRoute> = pawn.getColor() === Color.White
            ? [MoveRoute.Top, MoveRoute.TopLeft, MoveRoute.TopRight]
            : [MoveRoute.Bottom, MoveRoute.BottomLeft, MoveRoute.BottomRight];

        // First square of vertical route
        squares.push(route[moveRoutes[0]]![0]); // White: MoveRoute.Top[0], Black: MoveRoute.Bottom[0]

        // Second square of vertical route but only if the pawn is on its start position.
        if(pawn.getStartPosition() == square)
            squares.push(route[moveRoutes[0]]![1]); // White: MoveRoute.Top[1], Black: MoveRoute.Bottom[1]


        // Add the diagonal routes(if has enemy)
        if(BoardManager.hasPiece(route[moveRoutes[1]]![0], enemyColor))
            squares.push(route[moveRoutes[1]]![0]); // White: MoveRoute.TopLeft[0], Black: MoveRoute.BottomLeft[0]

        if(BoardManager.hasPiece(route[moveRoutes[2]]![0], enemyColor))
            squares.push(route[moveRoutes[2]]![0]); // White: MoveRoute.TopRight[0], Black: MoveRoute.BottomRight[0]

        return squares;
    }

    /**
     * Get the possible moves of the knight on the given square.
     */
    private getKnightMoves(square: Square): Array<Square> | null
    {
        let route: Array<Square> = this.routeCalculator.getKnightRoute(square);
        if(!route) return null;

        // Knight has no direction, so we don't need to convert the route to moves.
        return route;
    }

    /**
     * Get the possible moves of the bishop on the given square.
     */
    private getBishopMoves(square: Square): Array<Square> | null
    {
        let route: Path = this.routeCalculator.getBishopRoute(square);
        if(!route) return null;

        return Converter.convertPathToMoves(route);
    }

    /**
     * Get the possible moves of the rook on the given square.
     */
    private getRookMoves(square: Square): Array<Square> | null
    {
        let route: Path = this.routeCalculator.getRookRoute(square);
        if(!route) return null;

        return Converter.convertPathToMoves(route);
    }

    /**
     * Get the possible moves of the queen on the given square.
     */
    private getQueenMoves(square: Square): Array<Square> | null
    {
        let route: Path = this.routeCalculator.getQueenRoute(square);
        if(!route) return null;

        return Converter.convertPathToMoves(route);
    }

    /**
     * Get the possible moves of the king on the given square.
     */
    private getKingMoves(square: Square): Array<Square> | null
    {
        let route: Path = this.routeCalculator.getKingRoute(square);
        if(!route) return null;

        return Converter.convertPathToMoves(route);
    }
}