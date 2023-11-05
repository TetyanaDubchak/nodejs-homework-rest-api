const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const Contacts = require('../../models/contacts');
const contactsSchema = require('../../schemas/contacts');

const router = express.Router();
const jsonParser = express.json();

router.use(cors());
router.use(morgan('combined'));

router.get('/', async (req, res, next) => {
  try {
    const allContacts = await Contacts.listContacts();
    res.json(allContacts)
  } catch (error) {
    next(error);
  }
})
 
router.get('/:contactId', async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await Contacts.getContactById(contactId);
    if (contact) {
      res.json(contact);
    } else {
      next();
    }
    
  } catch (error) {
    next(error);
  }

})

router.post('/', jsonParser, async (req, res, next) => {
  try {
    const validatedStatus = contactsSchema.validate(req.body, { abortEarly: false });

    if (typeof validatedStatus.error !== "undefined") {
      return res.status(400).json(validatedStatus.error.details.map((err) => err.message).join(", "));
    }

    const contact = await Contacts.addContact(validatedStatus.value);
    
    res.status(201).json(contact );
  
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
        next();
    }
  } catch (error) {
      next(error);
  }
})
 
router.put('/:contactId',jsonParser, async (req, res, next) => {
  try {
      const body = req.body;
      const validatedStatus = contactsSchema.validate(body, { abortEarly: false });

      if (typeof validatedStatus.error !== "undefined") {
        return res.status(400).json(validatedStatus.error.details.map((err) => err.message).join(", "));
      }        
      const contactId = req.params.contactId;
      const updatedContact = await Contacts.updateContact(contactId, validatedStatus.value);
      
      if (updatedContact) {
        res.json( updatedContact );
      } else {
        next();
      }
    
  } catch (error) {
      next(error);
  }
})

router.use((_, res) => {
  res.status(404).json(" Not Found");
});

router.use((error, _, res, __) => {
  console.error(error);
  res.status(500).json("Internal Server Error");
});

module.exports = router
