/*
 * Remember - jQuery plugin
 * Easily track changes made to a form, or any element containing fields.
 *
 * Copyright (c) 2010 Andrew Smith
 * Examples and documentation at: http://github.com/ashrewdmint/classnotes
 * 
 * Version: 1.0.0 (01/31/2010)
 * Requires: jQuery v1.3+
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
  var remember = {
    // Key used to set and retrieve data on forms
    key_name: 'jquery.remember',
    
    // Serializes form elements and non-form elements.
    // Only fields with names will be serialized.
    serialize: function(el) {
      var field, tag, value, params = [];
      el.find('[name]:input').each(function(){
        field = $(this);
        tag   = field.get(0).nodeName.toLowerCase();
        value = field.val() ? field.val() : field.text();
        
        if (field.attr('type') == 'radio' && ! field.is(':checked')) {
          return;
        }
        
        params.push(escape(field.attr('name')) + '=' + escape(value));
      });
      
      return params.join('&');
    },
    
    // Finds the last serialization stored in the form. If no data is found,
    // the form will be serialized and the result stored.
    last: function(form) {
      var data = form.data(this.key_name);
      data = data ? data : this.serialize(form);
      form.data(this.key_name, data);
      return data;
    },
    
    // Returns whether or not the form has been changed.
    hasChanges: function(form) {
      return this.last(form) != this.serialize(form);
    },
    
    // Returns an array of changes. Each item in the array is an object.
    // Example result:
    //   [{name: 'fieldname', value: 'fieldvalue', element: jquery_object}]
    changes: function(form) {
      var new_state   = this.params_to_object(this.serialize(form));
      var saved_state = this.params_to_object(this.last(form));
      var changes = [];
      
      $.each(new_state, function(name, value) {
        if (saved_state[name] != value) {
          changes.push({
            'name':    name,
            'value':   value,
            'element': $('[name=' + name + ']')
          });
        }
      });
      
      return changes;
    },
    
    // Takes strings returned by form.serialize() and turns them into
    // objects with keys and values that match the string's keys and values.
    params_to_object: function(string) {
      var object = {};
      var array = string.split('&');

      $.each(array, function(name, value) {
        value = unescape(value).split('=');
        object[value[0]] = value[1];
      });

      return object;
    },
    
    // Erase the remembered form data.
    forget: function(form) {
      return form.removeData(this.key_name);
    }
  };
  
  $.fn.remember = function(method) {
    var forms, results, result;
    results = [];
    
    if (typeof(method) == 'undefined') {
      method = 'reset';
    }
    
    this.each(function(index, form) {
      form = $(form);
      switch (method) {
        case 'reset':
          remember.forget(form);
          results.push(remember.last(form));
        break;
        case 'changes':
          results.push(remember.changes(form));
        break;
        case 'hasChanges':
          results.push(remember.hasChanges(form));
        break;
        case 'forget':
          results.push(remember.forget(form));
        break;
      }
    });
    
    $.each(results, function(index, value) {
      switch (method) {
        // Returns array of all changes in all forms
        case 'changes':
          if (! result || typeof(result.length) == 'undefined') {
            result = [];
          }
          $.each(value, function(i, change){
            result.push(change);
          });
        break;
        
        // Returns true or false depending on whether or not any
        // changes were made in any of the forms.
        case 'hasChanges':
          if (typeof(result) != 'boolean') {
            result = false;
          }
          if (value) {
            result = true;
          }
        break;
      }
    });
    
    if (method == 'reset' || method == 'forget') {
      return this;
    }

    if (typeof(result) == 'undefined') {
      throw 'Undefined method "' + method + '" for jquery plugin remember';
    }
    
    return result;
  };
})(jQuery);