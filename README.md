# Form updating controls

In our _current_ interpretation of error handling we have the following stipulations:

1. Errors are not displayed until the form is submitted
2. Once the form is submitted the errors are displayed on a per-field basis
2. Errors are then _frozen_ on a _per-field_ basis until the field is _blurred_
3. Once a field is _blurred_ its error is erased (**not** evaluated based on current value) 

This means that errors are _extremely not stateless_ -- they are driven by a very 
specific update order, and must be locked in to respect the order of operations. 
