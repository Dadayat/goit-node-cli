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

async function getContactById(contactId) {
  const contacts = await listContacts();

  return contacts.find((contact) => contact.id === contactId) || null;
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

export default { listContacts, addContact, removeContact, getContactById };
