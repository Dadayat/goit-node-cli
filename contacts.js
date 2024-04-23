import * as fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf8" });

  return JSON.parse(data);
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function getContact() {
  const contacts = await listContacts();

  return contacts;
}

async function getContactById(contactId) {
  const contacts = await listContacts();

  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }
  const removedCnt = contacts[index];

  contacts.splice(index, 1);

  await writeContacts(contacts);

  return removedCnt;
}

async function addContact(contact) {
  const contacts = await listContacts();

  const newContact = { ...contact, id: crypto.randomUUID() };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
}
// async function addContact(name, email, phone) {
//   const id = nanoid();
//   const contact = { id, name, email, phone };
//   let existingContacts = [];

//   try {
//     const data = await fs.readFile(contactsPath, "utf8");
//     existingContacts = JSON.parse(data);
//   } catch (error) {}

//   existingContacts.push(contact);

//   await fs.writeFile(contactsPath, JSON.stringify(existingContacts, null, 2));

//   return contact;
// }

// Приклад використання функції addContact
// (async () => {
//   const contact = await addContact("Іван", "ivan@example.com", "+123456789");
//   console.log(contact); // Виведе об'єкт контакту
// })();

export default { listContacts, addContact, removeContact, getContactById };
