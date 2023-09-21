<h1 align = "center">Chess Platform</h1>
<p><a href = "https://chess-platform.onrender.com/">Live Demo</a> (The site may open slowly because I deployed the project to a free render account)</p>
<h3>Table of Contents</h3>
<ol>
    <li><a href = "https://github.com/bberkay/chess-platform/blob/main/README.md#introduction">Introduction</a></li>
    <li><a href = "https://github.com/bberkay/chess-platform/blob/main/README.md#features">Features</a></li>
    <li><a href = "https://github.com/bberkay/chess-platform/blob/main/README.md#architecture">Architecture</a></li>
    <li><a href = "https://github.com/bberkay/chess-platform/blob/main/README.md#installation">Installation</a></li>
    <li><a href = "https://github.com/bberkay/chess-platform/blob/main/README.md#usage">Usage</a></li>
    <li><a href = "https://github.com/bberkay/chess-platform/blob/main/README.md#testing">Testing</a></li>
    <li><a href = "https://github.com/bberkay/chess-platform/blob/main/README.md#future-plans">Future Plans</a></li>
</ol>
<h3>Introduction</h3>
<p>Chess Platform is a project that I developed as a system design work. This project is 
not designed by using chess programming techniques(0x88, bitboards, etc.). But all the
rules of chess are implemented in this project. The project consists of three parts:
Chess Platform, Platform, and Chess. Chess Platform provides connection of Platform and
Chess. Platform provides some components like notation table, score section, game creator,
and log console. Chess provides the engine and board and can be used without
Platform. Also, ChessBoard and ChessEngine can be used as standalone.</p>
<h3>Features</h3>
<ul>
    <li>by <a href = "https://github.com/bberkay/chess-platform/tree/main/src">ChessPlatform</a>
        <ul>
            <li>Connection between Platform and Chess</li>
        </ul>
    </li>
    <li>by <a href = "https://github.com/bberkay/chess-platform/tree/main/src/Chess">Chess</a>
        <ul>
            <li><b>General Rules:</b> Check, Checkmate, Stalemate.</li>
            <li><b>Other Rules:</b> <a href = "https://en.wikipedia.org/wiki/Threefold_repetition">Threefold repetition</a>, <a href = "https://en.wikipedia.org/wiki/Fifty-move_rule">Fifty-move rule</a>.</li>
            <li><b>Board:</b> Easily customizable from <a href = "https://github.com/bberkay/chess-platform/blob/main/src/Chess/Board/Assets/css/chessboard.css">css.</a></li>
            <li><b>Move Calculation</b>: Calculation and validation of every piece.</li>
            <li><b>Special Moves:</b> <a href = "https://en.wikipedia.org/wiki/Castling">Castling</a>, <a href = "https://en.wikipedia.org/wiki/Promotion_(chess)">Promotion</a>, <a href = "https://en.wikipedia.org/wiki/En_passant">En Passant</a>.</li>
            <li><b>Score Calculation:</b> For more information check <a href = "https://en.wikipedia.org/wiki/Chess_piece_relative_value">this.</a></li>
            <li><b>Algebraic Notation:</b> For more information check <a href = "https://en.wikipedia.org/wiki/Algebraic_notation_(chess)">this.</a></li>
            <li><b>Fen Notation:</b> For more information check <a href = "https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation">this.</a></li>
            <li><b>Caching:</b> With active-passive options.</li>
            <li><b>Logging:</b> Detailed descriptions of calculation in engine and board.</li>
            <li><b>Standalone Versions:</b> For use just board or engine.</li>
        </ul>
    </li>
    <li>by <a href = "https://github.com/bberkay/chess-platform/tree/main/src/Platform">Platform</a>
        <ul>
            <li><b>Notation Table:</b> Shows the algebraic notation calculated by chess on UI.</li>
            <li><b>Score Section:</b> Shows the score calculated by chess on UI.</li>
            <li><b>Game Creator:</b> Input for custom fen notation and select box for some template fen notations.</li>
            <li><b>Log Console:</b> Shows the log created by chess on UI in every action.</li>
        </ul>
    </li>   
</ul>
<h3>Architecture</h3>
<small><i>Technologies: HTML, CSS, JS, TypeScript, Node, Vite, Vitest</i></small>
<p>In this section, I will explain the project's architecture without going into too much detail as much as possible. As I mentioned in the introduction, the project currently consists of two main parts and the third part that provides connection between main parts and manages the app.</p>
<ul>
    <li>
        <strong>Chess Platform</strong><br/>
        The part that provides connection between Platform and Chess. Creates Chess instance and provides it to Platform instance. So, platform components can use chess instance and provides a start point for the project by creating chess and platform instances.
    </li><br/>
    <li>
        <strong>Chess</strong><br/>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus corporis dolor esse nihil nobis possimus quae quibusdam, reprehenderit sed? Adipisci assumenda autem consequatur cupiditate deleniti dolores eaque fugiat fugit repellat.
        <br/>
        <ul>
            <li>
                <strong>Chess Engine</strong><br/>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet assumenda debitis dolor.
            </li>
            <li>
                <strong>Chess Board</strong><br/>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet assumenda debitis dolor.
            </li>
        </ul>
    </li><br>
    <li>
        <strong>Platform</strong><br/>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus corporis dolor esse nihil nobis possimus quae quibusdam, reprehenderit sed? Adipisci assumenda autem consequatur cupiditate deleniti dolores eaque fugiat fugit repellat.
    </li>
</ul>

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

<h3>Installation</h3>
<ol>
    <li>
        Clone the repository or download the zip file from <a href = "https://github.com/bberkay/chess-platform/archive/refs/heads/main.zip">here.</a>
        <br/>
        <code>git clone https://github.com/bberkay/chess-platform.git</code>
    </li>
    <br/>
    <li>
        Install the dependencies(<i>typescript, vite, vitest</i>).
        <br/>
        <code>npm install</code>
    </li>
    <br/>
    <li>
        Run the project
        <br/>
        <code>npm run dev</code>
    </li>
</ol>
<h3>Usage</h3>
<h4>ChessPlatform(Full Version)</h4>


```html
<html>
    <head>
        <title>Chess Platform</title>
    </head>
    <body>
        <div id = "chessboard"></div> <!-- Required while using ChessPlatform -->
        <div id = "notation-table"></div> <!-- Optional, also provide score table -->
        <div id = "log-console"></div> <!-- Optional -->
        <div id = "game-creator"></div> <!-- Optional -->
        
        <!-- Initiate Chess Platform -->
        <script>
            import { ChessPlatform } from "./src/ChessPlatform";

            /**
             * If there is a game in cache, then platform 
             * will load it. Otherwise, platform will create 
             * a new standard game.
             */
            const chessPlatform = new ChessPlatform();
        </script>
    </body>
</html>
```

<h4>Chess(without Platform)</h4>

```html
<html>
    <head>
        <title>Chess without Platform</title>
    </head>
    <body>
        <div id = "chessboard"></div> <!-- Required while using Chess -->
        
        <!-- Initiate Chess without Platform -->
        <script>
            import { Chess } from "./src/Chess/Chess";

            /**
             * If there is a game in cache, then chess
             * will load it. Otherwise, chess will 
             * create a new standard game.
             */
            const chess = new Chess();
        </script>
    </body>
</html>
```

<h4>ChessBoard(Standalone)</h4>

```html
<html>
    <head>
        <title>Chessboard Standalone</title>
    </head>
    <body>
        <div id = "chessboard"></div> <!-- Required while using ChessBoard -->
        
        <!-- Initiate Chessboard as Standalone -->
        <script>
            import { ChessBoard } from "./src/Chess/Board/ChessBoard";

            // Standard game will be created in constructor.
            const chessBoard = new ChessBoard();
        </script>
    </body>
</html>
```

<h4>ChessEngine(Standalone)</h4>

```typescript
// somefile.ts/somefile.js
import { ChessEngine } from "./src/Chess/Engine/ChessEngine";
import { Square } from "./src/Chess/Types";

// Standard game will be created in constructor.
const chessEngine = new ChessEngine();

// Play on engine(without board)
chessEngine.playMove(Square.e2, Square.e4);
```

<p>For another example, see <a href = "https://github.com/bberkay/chess-platform/blob/main/index.html">index.html</a> of the <a href = "https://github.com/bberkay/chess-platform#chess-platform">Live Demo</a>.</p>

<h3>Testing</h3>
<p>Chess Platform is tested with <a href = "https://vitest.dev/">Vitest</a>. Tests consist mostly of engine tests like move calculation, move validation, checkmate, stalemate, etc. Also, there are some tests for converting operations like fen notation to <a href = "https://github.com/bberkay/chess-platform/blob/main/src/Chess/Types/index.ts#L78">json notation</a>.
You can run all the tests with the following command.</p>
<code>npm run test</code>
<h3>Future Plans</h3>
<p>My first plan is to switch from Node.js to <a href = "https://bun.sh/">Bun</a>. Multiplayer support, which will be controlled by ChessPlatform, is also one of my main goals. Along with multiplayer support, options such as proposing a takeback, offering a draw, resigning from a match, and viewing possibility of previous moves from the notation table will need to be developed. I also have some smaller plans on my list, such as <a href = "https://en.wikipedia.org/wiki/Portable_Game_Notation">PGN</a> support in chess and table marking in the chessboard.</p>
<hr>
<h5>Contact: <a href="mailto:berkaykayaforbusiness@outlook.com">berkaykayaforbusiness@outlook.com</a></h5> 
