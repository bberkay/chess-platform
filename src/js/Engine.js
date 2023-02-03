class Engine {
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

        if (route_path == null || route_path == "top") {
            let counter = 1;

            // Top of Column
            for (let i = square_id - 8; i > 0; i -= 8) {
                if (distance_limit && counter > distance_limit)
                    break;
                squares = squares.concat(this.#getPlayableSquares(i, piece_sensivity));
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
                squares = squares.concat(this.#getPlayableSquares(i, piece_sensivity));
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

        if (route_path == null || route_path == "right") {
            let counter = 1;

            // Right of Square
            for (let i = square_id + 1; i <= row * 8; i++) {
                if (distance_limit && counter > distance_limit)
                    break;
                squares = squares.concat(this.#getPlayableSquares(i, piece_sensivity));
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
                squares = squares.concat(this.#getPlayableSquares(i, piece_sensivity));
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


        // Top Left Diagonal of Piece
        if (route_path == null || route_path == "top" || route_path == "right") {
            counter = 1;
            if (this.getColumnOfSquare(square_id) != 1) { // if piece not on the far left
                for (let i = square_id - 9; i > 0; i -= 9) {
                    if (distance_limit && counter > distance_limit)
                        break;

                    squares = squares.concat(this.#getPlayableSquares(i, piece_sensivity, true));
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

                    squares = squares.concat(this.#getPlayableSquares(i, piece_sensivity, true));
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

                    squares = squares.concat(this.#getPlayableSquares(i, piece_sensivity, true));
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

                    squares = squares.concat(this.#getPlayableSquares(i, piece_sensivity, true));
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
     * @param {int} square Target Square(loop element, example 'i')
     * @param {boolean} piece_sensivity To avoid tripping over other pieces.
     * @param {boolean} diagonal Is path diagonal
     * @returns {Array<int>}
     */
    #getPlayableSquares(square, piece_sensivity, diagonal) {
        let squares = [];
        // If target square and current square is same then not push square to squares 
        if (piece_sensivity) {
            // if piece sensivity is true then calculate every piece on the path
            let square_type = isSquareHas(square);
            // Stop if any piece on the path and piece doesn't have to ability to jump(of course this control because of knight).    
            if (square_type == "friend") {
                squares.push("break");
                return squares;
            }
            else if (square_type == "enemy") {
                squares.push(square);
                squares.push("break");
                return squares;
            }
            else
                squares.push(square);
        }
        else // if piece sensivity is false add all squares to squares list
            squares.push(square);

        // if square reach the edges of the board
        if (diagonal) {
            if (this.getColumnOfSquare(square) == 8 || this.getColumnOfSquare(square) == 1)
                squares.push("break");
        }

        return squares;
    }

    /**
     * Get Unplayable Square on the path
     * @param {int} square_id Square ID of the target square
     * @returns {Array<int>}
     */
    getUnplayableSquares(square_id){
        let unplayable_squares = [];

        // Queen(Diagonal), Bishop, Pawn Control
        this.getDiagonalSquaresOfSquare({ square_id: square_id }).forEach(square => { // Get king's diagonal squares 
            const piece = getPieceBySquareID(square);
            if (piece.type == "pawn") {
                // TODO: Pawn kontrolü de burada yapılacak.
            }
            else if (piece.type == "bishop" || piece.type == "queen") {
                // check enemy diagonal direction
                if (this.getColumnOfSquare(square) < this.getColumnOfSquare(square_id)) {
                    // if left diagonal has queen or bishop then left diagonal in danger
                    this.getDiagonalSquaresOfSquare({ square_id: square_id, piece_sensivity: false, route_path: "left" }).forEach(item => {
                        unplayable_squares.push(item);
                    });
                }
                else {
                    // if right diagonal has queen or bishop then right diagonal in danger
                    this.getDiagonalSquaresOfSquare({ square_id: square_id, piece_sensivity: false, route_path: "right" }).forEach(item => {
                        unplayable_squares.push(item);
                    });
                }
            }
        });

        // Queen(Row, Column), Rook Control
        this.getColumnSquaresOfSquare({ square_id: square_id }).forEach(square => { // Get king's column squares 
            const piece = getPieceBySquareID(square);
            if (piece.type == "rook" || piece.type == "queen") {
                // if column has rook or queen then king can't play to any square at column
                this.getColumnSquaresOfSquare({ square_id: square, piece_sensivity: false }).forEach(item => {
                    unplayable_squares.push(item);
                });
            }
        });

        this.getRowSquaresOfSquare({ square_id: square_id }).filter(square => { // Get king's row squares 
            const piece = getPieceBySquareID(square);
            if (piece.type == "rook" || piece.type == "queen") {
                // if row has rook or queen then king can't play to any square at row
                this.getRowSquaresOfSquare({ square_id: square, piece_sensivity: false }).forEach(item => {
                    unplayable_squares.push(item);
                });
            }
        });

        // Knight Control

        return unplayable_squares;
    }

    /**
     * Check is square unplayable
     * @param {int} square_id Square ID of the target square
     * @returns {boolean}
     */
    isSquareUnplayable(square_id){
        if(this.getSquareIfUnplayable(square_id).length > 0)
            return true;
        else
            return false;
    }
}