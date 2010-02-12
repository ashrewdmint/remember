/*
 * Remember - jQuery plugin
 * Easily track changes made to a form, or any element containing fields.
 *
 * Copyright (c) 2010 Andrew Smith
 * Examples and documentation at: http://github.com/ashrewdmint/classnotes
 * 
 * Version: 1.0.1 (02/05/2010)
 * Requires: jQuery v1.3+
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
  $.remember = {
    // Key used to set and retrieve data on forms
    key_name: 'jquery.remember',
    
    // Serializes form elements and non-form elements.
    // Only fields with names will be serialized.
    serialize: function(el, return_object) {
      var field, tag, value, params = [];
      el.find('[name]:input').each(function(){
        field = $(this);
        
        // Unchecked radio buttons should not be serialized
        if (field.attr('type') == 'radio' && ! field.attr('checked')) {
          return;
        }
        
        params.push(escape(field.attr('name')) + '=' + escape(field.val()));
      });
      
      params = params.join('&');;
      
      if (return_object) {
        params = this.objectFromParams(params);
      }
      
      return params;
    },
    
    // Restores the fields to their last saved values
    restore: function(el) {
      el = $(el);
      var saved_state = this.objectFromParams(this.last(el));
      
      // Uncheck fields that aren't found
      el.find('[name]').each(function(){
        var field = $(this);
        var name = field.attr('name');
        
        if (! saved_state[name]) {
          field.attr('checked', false);
        }
      });
      
      // Reset value
      $.each(saved_state, function(name, value){
        var field = el.find('[name=' + name + ']');
        var type  = field.attr('type');
        var tag   = field.get(0).nodeName.toLowerCase();
        
        if (tag == 'textarea') {
          field.text(value);
        } else {
          // Check radio buttons
          if (type == 'radio') {
            field.attr('checked', true);
          }
          // Set value for other things
          else {
            field.val(value);
          }
        }
      });
    },
    
    // Finds the last serialization stored in the form. If no data is found,
    // the form will be serialized and the result stored.
    last: function(form, return_object) {
      var data = form.data(this.key_name);
      data = data ? data : this.serialize(form);
      form.data(this.key_name, data);
      
      if (return_object) {
        data = this.objectFromParams(data);
      }
      
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
      var new_state   = this.objectFromParams(this.serialize(form));
      var saved_state = this.objectFromParams(this.last(form));
      var changes = [];
      
      fields = $.extend({}, new_state, saved_state);
      
      $.each(fields, function(name, value) {
        if (saved_state[name] != new_state[name]) {
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
    objectFromParams: function(string) {
      var object = {};
      var array = string.split('&');

      $.each(array, function(name, value) {
        value = unescape(value).split('=');
        
        if (value.length > 0) {
          object[value[0]] = value[1];
        }
      });

      return object;
    },
    
    // Erase the remembered form data.
    forget: function(form) {
      return form.removeData(this.key_name);
    }
  };
  
  $.fn.remember = function(method, second) {
    var forms, results, result;
    results = [];
    
    if (typeof(method) == 'undefined') {
      method = 'save';
    }
    
    this.each(function(index, form) {
      form = $(form);
      switch (method) {
        case 'save':
          $.remember.forget(form);
          $.remember.last(form);
        break;
        case 'restore':
          $.remember.restore(form);
        break;
        case 'serialize':
          results.push($.remember.serialize(form, second));
          return;
        break;
        case 'last':
          results.push($.remember.last(form, second));
          return;
        break;
        case 'changes':
          results.push($.remember.changes(form));
        break;
        case 'hasChanges':
          results.push($.remember.hasChanges(form));
        break;
        case 'forget':
          results.push($.remember.forget(form));
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
        
        // Returns params
        case 'serialize':
          result = value;
        break;
        case 'last':
          result = value;
        break;
      }
    });
    
    if ($.inArray(method, ['save', 'forget', 'restore']) >= 0) {
      return this;
    }

    if (typeof(result) == 'undefined') {
      throw 'Undefined method "' + method + '" for jquery plugin remember';
    }
    
    return result;
  };
})(jQuery);