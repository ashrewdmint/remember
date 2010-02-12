# Remember

This jQuery plugin lets you easily track changes made to a form, or any element containing fields.

Where to find this plugin:

*  [jQuery Plugins](http://plugins.jquery.com/project/remember)
*  [GitHub](http://github.com/ashrewdmint/remember)

## Usage

To use, select any elements containing form fields and call the `remember()` method.

    $('form, .field-container').remember();
    // Returns any elements selected, so you can call more methods afterwards on the same line.

After changes are made to any fields in the selected elements, you can use `hasChanges`
to check whether or not changes were made.

    $('form, .field-container').remember('hasChanges');
    // Returns true or false

Additionally, `changes` returns an array of changes. Each element in the array is an
object, with `name`, `value`, and `element` properties.

    $('form, .field-container').remember('changes');
    // Returns something like:
    // [{name: 'fieldname', value: 'fieldvalue', element: jquery_object}]

Once changes have been made, you may want to use `reset` to reset the old data.

    $('form, .field-container').remember('reset');
    // Now the hasChanges method will return false

If you are done with this functionality, use the `forget` method.

    $('form, .field-container').remember('forget');
    // Data associated with this plugin has been forgotten.

And that's all. Enjoy!

## Changelog

### 1.0.1

*  Fixed a bug that prevented changes from being remembered on some
   field types (like textareas or select menus).

*  Fixed a bug that kept the "changes" method from returning fields
   when fields were removed (or modified in such a way so that they
   disappeared from the string generated during serialization).

### 1.0.0

*  Initial release

## License

Copyright (c) 2010 Andrew Smith.

Dual licensed under the MIT and GPL licenses:

*  [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
*  [http://www.gnu.org/licenses/gpl.html](http://www.gnu.org/licenses/gpl.html)