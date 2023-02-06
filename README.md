# Form Element Component test

## UX Requirements

In our _current_ interpretation of error handling we have the following stipulations:

1. Errors are not displayed until the form is submitted
2. Once the form is submitted the errors are displayed on a per-field basis
3. Errors are then _frozen_ on a _per-field_ basis until the field is _blurred_
4. Once a field is _blurred_ its error is erased (**not** evaluated based on current value) 

This means that errors are _extremely not stateless_ -- they are driven by a very 
specific update order, and must be locked in to respect the order of operations. 

<img src="/form_state.svg" alt="sequence" />

## Aria requirements

Additionally, it is best if we have a relationship between the error fields and the form elements. 
This is done by establishing an `aria-described-by=<error-field-id>` property in the input 
that points to the aria field along with an `aria-invaid=(true|false)` property, and a `rel=alert`
property in the Error component. 

An FormErrorMessage component and a set of linked id factory in utils helps establish this across
the board; for React Hook Forms, a ReactHookFormError component decorates this with a few listeners
for fixed "error types" produced by the RHF API, and a message keys lookup table for mapping 
specialized keys to specialized text messages. 

## A common quirk

There seems to be an interesting across-the-system error in which the hiding 
of the error accomplished by the onBlur handler seems to short circuit the 
form submission; in the RHF version I put a slight time delay
on this (cancellable by the submit handler) but it does seem to pop in once in a while.

## Controlled components 

All the systems herein have controlled components;this is implicit in React Hook form and just for parity
was enforced in other systems. In order for there to be both real-time and persistent error messages,
the displayed error is exposed as `.error` and the real-time error as `.valueErrror`. 
The former field (`.error`) is erased via `onBlur` listeners in state. 
