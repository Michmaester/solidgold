const express = require('express');
const router = express.Router();

const FingerprintController = require('../controllers/fingerprints')



router.get('/', async (req, res, next) => {

    try {

        let fingerprints = await FingerprintController.GetFingerprints()

        res.status(200).json({
            status: 'okay',
            data: fingerprints
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;