const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({posts: {title: 'Ex post', description: 'Ex description', user_id: req.user._id}});
});

module.exports = router;