// lib/db.js

// Komentar user
let comments = [];

export function getComments() {
  return comments;
}

export function addComment(comment) {
  comments.push(comment);
}

// Pesan dari form Hubungi Saya
let contactMessages = [];

export function getContactMessages() {
  return contactMessages;
}

export function addContactMessage(message) {
  contactMessages.push(message);
}
