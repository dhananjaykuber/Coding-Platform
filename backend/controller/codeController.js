const Code = require('../models/Code');

const submitCode = async (req, res) => {
  const { language, question } = req.body;

  console.log(req.body);

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    await Code.create({
      language,
      path: req.file.path,
      author: req.user._id,
      question: question,
    });

    res.status(200).json({ message: 'Code saved to servver' });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed' });
  }
};

module.exports = { submitCode };
