const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  number: {
    type: Number,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  template: {
    type: Map,
    of: String,
  },
  testCases: {
    type: Map,
    of: [
      {
        input: {
          type: mongoose.Schema.Types.Mixed,
        },
        output: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
  },
});

module.exports = mongoose.model('Question', questionSchema);

// {
//   "number": 1,
//   "title": "Add two numbers",
//   "description": "Write a program to add two numbers",
//   "template": {
//       "cpp": "#include <iostream>\nusing namespace std;\n\nint addTwoNumbers(int a, int b) {\n    // Your code here\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << addTwoNumbers(a, b);\n    return 0;\n}",
//       "java": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int a = scanner.nextInt();\n        int b = scanner.nextInt();\n        int result = addTwoNumbers(a, b);\n        System.out.println(result);\n    }\n\n    public static int addTwoNumbers(int a, int b) {\n        // Your code here\n    }\n}",
//       "python": "def addTwoNumbers(a, b):\n    # Your code here\n    pass\n\nif __name__ == \"__main__\":\n    a, b = map(int, input().split())\n    result = addTwoNumbers(a, b)\n    print(result)"
//   },
//   "testCases": {
//       "cpp": [
//           { "input": "1 2", "output": 3 },
//           { "input": "5 9", "output": 14 },
//           { "input": "-25 5", "output": -20 },
//           { "input": "-8 -8", "output": -16 }
//           ],
//       "java": [
//           { "input": "1 2", "output": 3 },
//           { "input": "5 9", "output": 14 },
//           { "input": "-25 5", "output": -20 },
//           { "input": "-8 -8", "output": -16 }
//       ],
//       "python": [
//           { "input": "1 2", "output": 3 },
//           { "input": "5 9", "output": 14 },
//           { "input": "-25 5", "output": -20 },
//           { "input": "-8 -8", "output": -16 }
//       ]
// }
// }
