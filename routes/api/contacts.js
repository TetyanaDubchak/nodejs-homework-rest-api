const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();
require('../../db');

const ContactController = require('../../controllers/contact');

const router = express.Router();
const jsonParser = express.json();

router.use(cors());
router.use(morgan('combined'));

router.get('/', ContactController.listContacts)
 
router.get('/:contactId', ContactController.getContactById)

router.post('/', jsonParser, ContactController.addContact)

router.delete('/:contactId', ContactController.removeContact)

router.put('/:contactId',jsonParser, ContactController.updateContact)

router.patch('/:contactId/favorite',jsonParser, ContactController.updateStatusContact)

router.use((_, res) => {
  res.status(404).json(" Not Found");
});

router.use((error, _, res, __) => {
  console.error(error);
  res.status(500).json("Internal Server Error");
});

module.exports = router
