const LanguageModel = require('../models/languageModel');

exports.getAllLanguages = (req, res, next) => {
  try {
    const languages = LanguageModel.findAll();
    res.json({
      status: 'success',
      data: languages
    });
  } catch (error) {
    next(error);
  }
};
