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
    const contactId = req.params.contactId;
    const contact = await Contacts.getContactById(contactId);
    if (contact) {
      res.json({ message: contact });
    } else {
      res.status(404).json({message: "Not found"})
    }
    
  } catch (error) {
    next(error);
  }

})

router.post('/', jsonParser, async (req, res, next) => {
    try {
    const {name, email, phone} = req.body;
    const contact = await Contacts.addContact(name, email, phone);
    
    res.status(201).json({contact });
  
    
  } catch (error) {
    next(error);
  }
  
})

router.delete('/:contactId', async (req, res, next) => {
    try {
      const contactId = req.params.contactId;
      const contact = await Contacts.removeContact(contactId);
      
      if (contact) {
      res.json({ message: 'Contact deleted '});
    } else {
      res.status(404).json({message: "Not found"})
    }
  } catch (error) {
      next(error);
  }
})
 
router.put('/:contactId',jsonParser, async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;
      const contactId = req.params.contactId;
      const updatedContact = await Contacts.updateContact(contactId,name, email, phone);
      
    if (updatedContact) {
      res.json({ updatedContact });
    } else {
      res.status(404).json({ message: '"Not found"' });
    }
    
  } catch (error) {
      next(error);
  }
})

module.exports = router
