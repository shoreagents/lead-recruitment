# Inbox Zero Challenge Game Concept

## Objective
Simulate a real-world email inbox with a stream of incoming messages. The player must triage, respond, archive, or escalate emails based on content and priority — all within a set time limit.

## Skills Assessed
- Time Management
- Attention to Detail
- Work Ethic

## Game Logic
- Each round presents 10–20 simulated emails in random order.
- Emails may include:
  - Urgent requests
  - Spam or irrelevant content
  - Follow-ups
  - Conflicting deadlines
  - High-stakes client messages
- Player actions:
  - **Reply** (requires typing or multiple-choice logic)
  - **Archive**
  - **Flag for follow-up**
  - **Mark as spam**
- Some emails have hidden urgency (e.g., “Please send this by 3 PM today”).

## Scoring System
| Action                           | Points       |
|----------------------------------|--------------|
| Correct action on high-priority email | +10     |
| Quick but wrong action                | -5      |
| Missed urgent email                   | -10     |
| Processed irrelevant spam correctly  | +3      |
| Archive instead of reply (if wrong)  | -7      |
| Time left unused                     | Bonus   |

## Game Loop
1. Generate batch of emails (text + tags).
2. Start countdown timer (e.g., 3 minutes).
3. Player must respond to each item using a dropdown or quick action key.
4. After time ends:
   - Calculate score
   - Provide feedback on missed/incorrect responses
   - Offer replay with new randomized emails

## Possible Implementation
- **Terminal Version**: Use JSON scenarios and text prompts in Python.
- **Browser Version**: HTML/CSS/JS UI with mock inbox, clickable actions, and countdown.
- **Advanced Option**: Add sentiment/tone detection or misleading messages to increase difficulty.
