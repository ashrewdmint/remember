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
    return_methods:     ['hasChanges', 'changes', 'last', 'serialize'],
    silent_methods:     ['save', 'restore', 'forget'],
    first_only_methods: ['last', 'serialize'],
    
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
    
    // Forgets all data, then calls last to set new data
    save: function(form) {
      this.forget(form);
      this.last(form);
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
    if (typeof(method) == 'undefined') {
      method = 'save';
    }
    
    var items  = this;
    var values = [];
    var result = null;
    
    // Ignore multiple items if this method only deals with the first item
    if ($.inArray(method, $.remember.first_only_methods) >= 0) {
      items = items.eq(0);
    }
    
    // If this method should return something
    if ($.inArray(method, $.remember.return_methods) >= 0) {
      items.each(function(){
        // Call method
        var value = $.remember[method]($(this), second);
        
        switch (method) {
          case 'hasChanges':
            // If there are no changes so far, set the result to the method response
            // If the result gets set to true, it won't be changed anymore
            if (! result) {
              result = value;
            }
          break;
          case 'changes':
            if (! $.isArray(result)) {
              result = [];
            }
            // Loop through each changed item and add it to the result array
            $.each(value, function(){
              result.push(this);
            });
          break;
          default:
            result = value;
          break;
        }
      });  
        
      return result;
    }
    // If this is a silent method
    else if ($.inArray(method, $.remember.silent_methods) >= 0) {
      items.each(function(){
        $.remember[method]($(this));
      });
    }
    // Error!
    else {
      throw 'Undefined method "' + method + '" for jQuery plugin remember';
    }
    // Return jQuery object by default
    return this;
  };
})(jQuery);