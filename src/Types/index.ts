/**
 * Color enum for the color of the chess pieces and the players.
 * @see For more information, check src/Models/PieceModel.ts
 */
export enum Color{
    White = "White",
    Black = "Black"
}

/**
 * Square enum for board squares.
 * @see For more information, check src/Engine/Core/Board/BoardEngine.ts
 */
export enum Square{
    a1 = 57, a2 = 49, a3 = 41, a4 = 33, a5 = 25, a6 = 17, a7 = 9, a8 = 1,
    b1 = 58, b2 = 50, b3 = 42, b4 = 34, b5 = 26, b6 = 18, b7 = 10, b8 = 2,
    c1 = 59, c2 = 51, c3 = 43, c4 = 35, c5 = 27, c6 = 19, c7 = 11, c8 = 3,
    d1 = 60, d2 = 52, d3 = 44, d4 = 36, d5 = 28, d6 = 20, d7 = 12, d8 = 4,
    e1 = 61, e2 = 53, e3 = 45, e4 = 37, e5 = 29, e6 = 21, e7 = 13, e8 = 5,
    f1 = 62, f2 = 54, f3 = 46, f4 = 38, f5 = 30, f6 = 22, f7 = 14, f8 = 6,
    g1 = 63, g2 = 55, g3 = 47, g4 = 39, g5 = 31, g6 = 23, g7 = 15, g8 = 7,
    h1 = 64, h2 = 56, h3 = 48, h4 = 40, h5 = 32, h6 = 24, h7 = 16, h8 = 8
}

/**
 * PieceType enum for the type of the chess pieces.
 * @see For more information, check src/Models/PieceModel.ts
 */
export enum PieceType{
    Pawn = "Pawn",
    Knight = "Knight",
    Bishop = "Bishop",
    Rook = "Rook",
    Queen = "Queen",
    King = "King"
}

/**
 * @description CastlingType enum for the castling types.
 * @see src/Engine/Checker/MoveChecker.ts For more information.
 */
export enum CastlingType{
    WhiteLong = "WhiteLong",
    WhiteShort = "WhiteShort",
    BlackLong = "BlackLong",
    BlackShort = "BlackShort"
}

/**
 * @description White/Black Long mean White/Black player's queen side, White/Black Short mean White/Black player's king side.
 * @see src/Engine/Checker/MoveChecker.ts For more information.
 */
export type CastlingStatus = Record<CastlingType, boolean>;

/**
 * @description EnPassantDirection enum for the en passant directions.
 * @see src/Engine/Checker/MoveChecker.ts For more information.
 */
export enum EnPassantDirection{
    Left = "Left",
    Right = "Right",
    Both = "Both"
}

/**
 * Json notation for is alternative notation for the FEN notation.
 */
export interface JsonNotation{
    board: Array<{color: Color, type:PieceType, square:Square}>;
    turn: Color;
    castling: CastlingStatus;
    enPassant: Square | null;
    halfMoveClock: number | 0;
    fullMoveNumber: number | 0;
}

/**
 * StartPosition enum for the start positions.
 * @see For more information, check src/Chess.ts
 */
export enum StartPosition{
    Standard = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    Empty = "8/8/8/8/8/8/8/8 w - - 0 1",
    EnPassantRight = "8/k1pp4/8/8/8/8/4PP1K/8 w - - 0 1",
    EnPassantLeft = "8/k3pp2/8/8/8/8/2PP3K/8 w - - 0 1",
    Check = "7k/5r2/8/3Q4/8/8/8/4K3 w - - 0 1",
    Checkmate = "k7/8/4rp2/8/8/8/1R5K/1R6 w - - 0 1",
    Stalemate = "k7/8/5R2/8/8/8/7K/1R6 w - - 0 1",
    Promotion = "2k5/4P3/8/8/8/8/2p5/4K3 w - - 0 1",
    Castling = "r3k2r/8/8/4b3/4B3/8/8/R3K2R w KQkq - 0 1",
}

/**
 * CacheLayer enum for the cache layers.
 * @see src/Managers/CacheManager.ts For more information.
 */
export enum CacheLayer{
    Game = "Game",
    UI = "UI"
}

/**
 * LogType enum for the LOG types.
 * @see src/Managers/LogManager.ts For more information.
 */
export enum LogType{
    Info = "Info",
    Warning = "Warning",
    Error = "Error"
}


