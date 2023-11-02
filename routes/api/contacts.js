const express = require('express');

const Contacts = require('../../models/contacts');

const router = express.Router();

const jsonParser = express.json();

router.get('/', async (req, res, next) => {
  try {
    const allContacts = await Contacts.listContacts();
    res.json({ message: allContacts })
  } catch (error) {
    next(error);
  }
})
 
router.get('/:contactId', async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const contact = await Contacts.getContactById(contactId);
    if (contact) {
      res.json({ message: contact });
    } else {
      res.status(404).json({message: "Not found"})
    }
    
  } catch (error) {
    next(error);
  }
  res.json({ message: 'Contact' })
})

router.post('/', jsonParser, async (req, res, next) => {
  res.json({ message: 'Created contact' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'Deleted contact' })
})
 
router.put('/:contactId',jsonParser, async (req, res, next) => {
  res.json({ message: 'Change contact' })
})

module.exports = router
