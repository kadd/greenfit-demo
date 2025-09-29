const express = require('express');
const { getContent, 
    updateContent, updateTerms,
   updatePrivacy, updateFaq, updateBlog, updateImpressum
} = require('../controllers/contentController');
const router = express.Router();

router.get('/', getContent);
router.post('/', updateContent);
router.put('/terms', updateTerms);
router.put('/privacy', updatePrivacy);
router.put('/faq', updateFaq);
router.put('/blog', updateBlog);
router.put('/impressum', updateImpressum);

module.exports = router;
