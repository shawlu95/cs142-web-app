'use strict';

// Store the value of the input template as a property of the function.
function Cs142TemplateProcessor(template) {
  this.template = template;
}

// Use the prototype to add a new property fillIn in the function.
Cs142TemplateProcessor.prototype.fillIn = function (dictionary) {
  var formatted = this.template;

  // First loop through the dictionary to replace all valid "{{ key }}" forms.
  for (var key in dictionary) {
    formatted = formatted.replace("{{" + key + "}}", dictionary[key]);
  }

  // For "{{ }}" words with no valid corresponding keys in the dictionary,
  // use regular expression to replace them with an empty space.
  // Use 'g' modifier to replace all occurence.
  var reg = new RegExp('\\{\\{\\w*\\}\\}', 'g');
  formatted = formatted.replace(reg, "");
  return formatted;
};
