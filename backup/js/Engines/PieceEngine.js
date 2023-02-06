class PieceEngine{
    /**
     * Get Column of Square
     * @param {int} square_id Square ID of the active piece
     * @returns {int}
     */
    getColumnOfSquare(square_id) {
        return square_id % 8 == 0 ? 8 : square_id % 8;
    }

    /**
     * Get Row of Square
     * @param {int} square_id Square ID of the active piece
     * @returns {int}
     */
    getRowOfSquare(square_id) {
        return Math.ceil(square_id / 8);
    }

    /**
     * Get Column Squares List of Square
     * @param {int} square_id Square ID of the active piece
     * @param {(string|null)} route_path Specific route path only "top" or "bottom" of square
     * @param {(int|null)} distance_limit Move away at most [distance_limit] squares from square.
     * @param {boolean} piece_sensivity To avoid tripping over other pieces.
     * @returns {Array<int>}
     */
    getColumnSquaresOfSquare({ square_id, distance_limit = null, route_path = null, piece_sensivity = true }) {
        let squares = [];
        const current_square_id = square_id;
        if (route_path == null || route_path == "top") {
            let counter = 1;

            // Top of Column
            for (let i = square_id - 8; i > 0; i -= 8) {
                if (distance_limit && counter > distance_limit)
                    break;
                squares = squares.concat(this.#getPlayableSquares(current_square_id, i, piece_sensivity));
                if (squares.includes("break")) {
                    squares.pop(); // delete "break" from squares
                    break;
                }
                counter += 1;
            }
        }

        if (route_path == null || route_path == "bottom") {
            let counter = 1;

            // Bottom of Column
            for (let i = square_id + 8; i < 65; i += 8) {
                if (distance_limit && counter > distance_limit)
                    break;
                squares = squares.concat(this.#getPlayableSquares(current_square_id, i, piece_sensivity));
                if (squares.includes("break")) {
                    squares.pop();
                    break;
                }
                counter += 1;
            }
        }

        return squares;
    }

    /**
     * Get Row Squares List of Square
     * @param {int} square_id Square ID of the active piece
     * @param {(string|null)} route_path Specific route path only "left" or "right"
     * @param {(int|null)} distance_limit Move away at most [distance_limit] squares from square.
     * @param {boolean} piece_sensivity To avoid tripping over other pieces.
     * @returns {Array<int>}
     */
    getRowSquaresOfSquare({ square_id, distance_limit = null, route_path = null, piece_sensivity = true }) {
        let squares = [];
        let row = this.getRowOfSquare(square_id);
        const current_square_id = square_id;

        if (route_path == null || route_path == "right") {
            let counter = 1;

            // Right of Square
            for (let i = square_id + 1; i <= row * 8; i++) {
                if (distance_limit && counter > distance_limit)
                    break;
                squares = squares.concat(this.#getPlayableSquares(current_square_id, i, piece_sensivity));
                if (squares.includes("break")) { // delete "break" from squares
                    squares.pop();
                    break;
                }
                counter += 1;
            }
        }

        if (route_path == null || route_path == "left") {
            let counter = 1;

            // Left of Square
            for (let i = square_id - 1; i >= (row * 8) - 7; i--) {
                if (distance_limit && counter > distance_limit)
                    break;
                squares = squares.concat(this.#getPlayableSquares(current_square_id, i, piece_sensivity));
                if (squares.includes("break")) {
                    squares.pop();
                    break;
                }
                counter += 1;
            }
        }

        return squares;
    }

    /**
     * Get Diagonal Squares List of Piece
     * @param {int} square_id Square ID of the active piece
     * @param {(string|null)} route_path Specific route path only "bottom", "top" or "left"(left top and right bottom), "right"(right top and left bottom)
     * @param {(int|null)} distance_limit Move away at most [distance_limit] squares from square.
     * @param {boolean} piece_sensivity To avoid tripping over other pieces.
     * @returns {Array<int>}
     */
    getDiagonalSquaresOfSquare({ square_id, distance_limit = null, route_path = null, piece_sensivity = true }) {
        let squares = [];
        let counter = 1;
        const current_square_id = square_id;
        
        // Top Left Diagonal of Piece
        if (route_path == null || route_path == "top" || route_path == "right") {
            counter = 1;
            if (this.getColumnOfSquare(square_id) != 1) { // if piece not on the far left
                for (let i = square_id - 9; i > 0; i -= 9) {
                    if (distance_limit && counter > distance_limit)
                        break;

                    squares = squares.concat(this.#getPlayableSquares(current_square_id, i, piece_sensivity, true));
                    if (squares.includes("break")) { // delete "break" from squares
                        squares.pop();
                        break;
                    }
                    counter += 1;
                }
            }
        }

        // Left Bottom Diagonal of Piece
        if (route_path == null || route_path == "bottom" || route_path == "left") {
            counter = 1;
            if (this.getColumnOfSquare(square_id) != 1) {
                for (let i = square_id + 7; i < 65; i += 7) {
                    if (distance_limit && counter > distance_limit)
                        break;

                    squares = squares.concat(this.#getPlayableSquares(current_square_id, i, piece_sensivity, true));
                    if (squares.includes("break")) {
                        squares.pop();
                        break;
                    }
                    counter += 1;
                }
            }
        }

        // Top Right Diagonal of Piece
        if (route_path == null || route_path == "top" || route_path == "left") {
            counter = 1;
            if (this.getColumnOfSquare(square_id) != 8) { // if piece not on the far right
                for (let i = square_id - 7; i > 0; i -= 7) {
                    if (distance_limit && counter > distance_limit)
                        break;

                    squares = squares.concat(this.#getPlayableSquares(current_square_id, i, piece_sensivity, true));
                    if (squares.includes("break")) {
                        squares.pop();
                        break;
                    }
                    counter += 1;
                }
            }
        }

        // Bottom Right Diagonal of Piece
        if (route_path == null || route_path == "bottom" || route_path == "right") {
            counter = 1;
            if (this.getColumnOfSquare(square_id) != 8) {
                for (let i = square_id + 9; i < 65; i += 9) {
                    if (distance_limit && counter > distance_limit)
                        break;

                    squares = squares.concat(this.#getPlayableSquares(current_square_id, i, piece_sensivity, true));
                    if (squares.includes("break")) {
                        squares.pop();
                        break;
                    }
                    counter += 1;
                }
            }
        }
        return squares;
    }

    /**
     * Get Playable Square on the path
     * @param {int} current_square_id Current Square 
     * @param {int} target_square_id Target Square(loop element, example 'i')
     * @param {boolean} piece_sensivity To avoid tripping over other pieces.
     * @param {boolean} diagonal Is path diagonal
     * @returns {Array<int>}
     */
    #getPlayableSquares(current_square_id, target_square_id, piece_sensivity, diagonal = false) {
        let squares = [];

        // If target square and current square is same then not push square to squares 
        if (piece_sensivity) { // if piece sensivity is true then calculate every piece on the path
            // Control square 
            let square_type = GameController.isSquareHasPiece(target_square_id);
            if(square_type)
                square_type = GameController.isSquareHasEnemy(target_square_id, GameController.getPieceBySquareID(current_square_id).color) ? "enemy" : "friend";

            // Stop if any piece on the path and piece doesn't have to ability to jump(of course this control because of knight).    
            if (square_type == "friend") {
                squares.push("break");
                return squares;
            }
            else if (square_type == "enemy") {
                squares.push(target_square_id);
                squares.push("break");
                return squares;
            }
            else
                squares.push(target_square_id);
        }
        else // if piece sensivity is false add all squares to squares list
            squares.push(target_square_id);

        // if square reach the edges of the board
        if (diagonal) {
            if (this.getColumnOfSquare(target_square_id) == 8 || this.getColumnOfSquare(target_square_id) == 1)
                squares.push("break");
        }

        return squares;
    }

    /**
     * Get Unplayable Square on the path(for check operations)
     * @param {int} square_id Square ID of the target square
     * @returns {Array<int>}
     */
    getUnplayableSquares(square_id) {
        let enemy_color;
        let unplayable_squares = [];

        // Find Enemy Color
        let piece = GameController.getPieceBySquareID(square_id);
        if(GameController.isSquareHasPiece(square_id) && piece.type == "king")
            enemy_color = piece.color == "white" ? "black" : "white";
        else
            enemy_color = gl_current_move == "white" ? "black" : "white";

        // All Piece Type for get all enemy
        let piece_types = ["queen", "bishop", "rook", "knight", "king"];

        // Is enemy [piece_type] threatening target square then get [piece_type]'s playable squares and add to unplayable squares
        piece_types.forEach(type => {
            let enemy_pieces = GameController.getActivePiecesWithFilter(type, enemy_color);
            if (enemy_pieces) {
                enemy_pieces.forEach(enemy_piece => {
                    // get pieces playable squares
                    enemy_piece = enemy_piece.getPlayableSquaresOfPiece();
                    console.log(enemy_piece);
                    enemy_piece.forEach(square => {
                        if (square_id == square) // if any playable square equal target square then
                            unplayable_squares.push(square); // add to unplayable squares
                    });
                });
            }
        });

        // Pawn control(because pawn can only kill its diagonal squares not all playable squares like other pieces)
        let enemy_pawns = GameController.getActivePiecesWithFilter("pawn", enemy_color);
        if (enemy_pawns) {
            enemy_pawns.forEach(enemy_pawn => {
                let enemy_pawn_pos = GameController.getSquareIDByPiece(enemy_pawn); // get pawn square id
                if (enemy_color == "white") {
                    // get white pawn killable squares(white pawn first diagonal squares + 7 and + 9)
                    if (square_id == enemy_pawn_pos + 7 || square_id == enemy_pawn_pos + 9)
                        unplayable_squares.push(square_id); 
                } else {
                    // get black pawn killable squares(black pawn first diagonal squares - 7 and - 9)
                    if (square_id == enemy_pawn_pos - 7 || square_id == enemy_pawn_pos - 9)
                        unplayable_squares.push(square_id);
                }
            });
        }

        return unplayable_squares;
    }

    /**
     * Check is square unplayable(for check operations)
     * @param {int} square_id Square ID of the target square
     * @returns {boolean}
     */
    isSquareUnplayable(square_id) {
        if (this.getUnplayableSquares(square_id).length > 0)
            return true;
        return false;
    }

}