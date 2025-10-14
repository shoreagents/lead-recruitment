# Logic Grid Game Concept

## Objective
Challenge the player to deduce a correct set of relationships using logical clues, similar to classic logic grid puzzles.

## Skills Assessed
- Problem-Solving
- Critical Thinking
- Attention to Detail

## Game Logic
- The player is given:
  - A set of **entities** (e.g., names, colors, numbers)
  - A set of **clues** that define their relationships
- The goal is to determine the exact mapping between all items based on clues.
- The system checks if the solution matches the answer key.

## Game Loop
1. Load a predefined puzzle:
   - Example:
     - Person A owns a red car.
     - The person who owns a green car is not John.
     - The blue car is faster than the red one.
2. Provide interactive grid or selection options.
3. Allow player to make guesses and cross-checks.
4. Submit final mapping.
5. Validate against correct solution.
6. Display score or completion status.

## Possible Implementation
- Web: A drag-and-drop grid with checkboxes for logic mapping
- Terminal: Text-based input for assigning values
