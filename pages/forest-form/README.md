# A Forest driven form

Given the requirements

1. Errors are not displayed until the form is submitted
2. Once the form is submitted the errors are displayed on a per-field basis
3. Errors are then _frozen_ on a _per-field_ basis until the field is _blurred_
4. Once a field is _blurred_ its error is erased (**not** evaluated based on current value) 

Using forest has some of the same value as custom reducers; additionally it has:

* the ability to map actions directly to sub-elements of the state
* bound event listeners that can be injected directly into property handlers
* auto-generated field setters for each child node

Forest is a RxJS-powered state engine that allows for a structured, nested state system
to distribute control directly into its sub-structures. 

## Overall Impact

Forest has a much more compressed footprint than the reviewer with most of the same features. 
It does, like RHF, extend the dependencies of the site. It does, however, have a
unique configuration that takes a while to get used to, 
