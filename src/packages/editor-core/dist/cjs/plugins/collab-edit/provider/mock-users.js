"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParticipant = void 0;
var participants = ['Awilda Mcentire', 'Katie Iddings', 'Serafina Mcdowell', 'Eun Knopp', 'Walker Reighard', 'Keely Muth', 'Allie April', 'Rosamond Paton', 'Lashawnda Peppard', 'Hubert Feingold', 'Idalia Mcquaig', 'Wyatt Byer', 'Genevieve Reeder', 'Dona Elton', 'Jerilyn Holte', 'Salina Erhardt', 'Velda Latour', 'Regina Richer', 'Natisha Tiger', 'Glynda Stuckey', 'Wilson Woodberry', 'Elvie Furtado', 'Lasandra Palmatier', 'Louise Mijares', 'Herma Vanleer', 'Titus Plante', 'James Fiscus', 'Ina Ramero', 'Jeanene Bernabe', 'Lida Lepine', 'Rosalina Palka', 'Dayle Grossi', 'Zack Leister', 'Isobel Fay', 'Elouise Kluge', 'Twyla Machin', 'Diane Herrington', 'Fumiko Elders', 'Kennith Howe', 'Doloris Mccollom', 'Daryl Wherry', 'Sade Albury', 'Roy Cork', 'Hunter Hultgren', 'Mi Miley', 'Isabelle Halperin', 'Kayla Starke', 'Allyson Woomer', 'Sirena Politte', 'Patricia Scovil'];

var getParticipant = function getParticipant(userId) {
  var id = +userId.split('/')[1]; // eslint-disable-next-line no-bitwise

  var name = participants[(id | 0) % participants.length];
  return {
    userId: userId,
    name: name,
    avatar: "https://api.adorable.io/avatars/80/".concat(name.replace(/\s/g, ''), ".png"),
    email: "".concat(name.replace(/\s/g, '').toLocaleLowerCase(), "@atlassian.com")
  };
};

exports.getParticipant = getParticipant;