const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/contacts')

const {
  validationAddContact,
  validationUpdateContact,
  validationUpdateStatusContact
} = require('./validation-contact')

const guard=require('../../helper/guard')

router.get('/', guard, ctrl.getAll)
router.post('/', guard, validationAddContact, ctrl.createContact)

router.get('/:contactId', guard, ctrl.getById)
router.delete('/:contactId', guard, ctrl.removeContact)
router.put('/:contactId', guard, validationUpdateContact, ctrl.updateContact)

router.patch('/:contactId/favorite', guard, validationUpdateStatusContact, ctrl.updateStatusContact)

module.exports = router
