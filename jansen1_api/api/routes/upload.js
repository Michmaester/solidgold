const express = require('express');
const router = express.Router();
const lodash = require('lodash')
const multer = require('multer');
const crypto = require('crypto')
const path = require('path');
const fs = require('fs');

const dirPath = path.join(process.cwd(), '/public/uploads');



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dirPath + '/' + req.body.folderDir)
    },
    filename: function (req, file, cb) {

        let filename = null

        const ext = file.mimetype.split("/")[1];

        if (req.body.prefixName) {
            filename = req.body.prefixName + '_' + crypto.randomBytes(30).toString('hex')
        } else {
            filename = crypto.randomBytes(30).toString('hex')
        }

        cb(null, filename + "." + ext);
    }
})

var upload = multer({ storage: storage })

router.get('/', async (req, res, next) => {

    try {

        // let results = await PlantController.GetPlants()

        res.status(200).json({
            status: 'okay',
            data: 'upload endpoint'
        })

    } catch (error) {
        next(error)
    }

})


router.post('/multi_images', upload.array('images'), async (req, res, next) => {

    if (req.files.length > 0) {
        res.json({
            status: 'okay',
            files: req.files
        });
    }
    else throw 'error';

})


module.exports = router;