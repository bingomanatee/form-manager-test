# Interpreting react-hook-form for our requirements

React Hook Form has marvellous shorthand for error handling -- however it does 
enforce a _tempo of display_ that is not in keeping with our requirements:

1. Errors are not displayed until the form is submitted
2. Once the form is submitted the errors are displayed on a per-field basis
3. Errors are then _frozen_ on a _per-field_ basis until the field is _blurred_
4. Once a field is _blurred_ its error is erased (**not** evaluated based on current value) 

Rules 1 and 2 can be engineered using React Form Hooks. 

But rule 3 cannot be engineered in RHF; RHF aggressively updates the user feedback 
_dynamically_ after a form is submitted. 

While this may be _good_ UX - it is not _our_ UX.

Therefore - once a form is submitted, the errors are copied into a "shadow" 
error object, `errorsOnSubmit`. This is done using the second argument to onSubmit,
an `onError` listener. 

### Resetting errors on field blur

When a field is blurred, `errorsOnSubmit`'s error for that field is erased.
This is done by injecting a hook into the onBlur handler returned by `register()`

There is a certain race condition in which the submit button is clicked while a 
form field is focused. A timeout mechanic manages this; it's a bit hackish but it
also indicates the kind of work that will be required to reassert event listeners
into an item under RHF control. 

## Error interpretation 

Errors are expressed as an object rather than a single message, in the form
`{type: [string]` which can easily feed into `formatMessage`. 

## Overall summary

There is a _very_ rich set of options for field validation which can make a lot of
basic tasks quite easy to manage. However, there is a fixed amount of work that 
overcoming the opinionated tempo of RHF's update cycle. If that can be got past,
it does have a potential to lower tech debt on form handling. 

Accepting the tempo of RHF _may not be a bad thing_. it provides faster feedback to
users as they try and fix the problems in the form, to streamline their input. 

A large amount of the handstands has been put into a HOC for forms,
allowing for most of the conventions of RHF to be used by consuming components. 
