# A Reducer driven form

Given the requirements

1. Errors are not displayed until the form is submitted
2. Once the form is submitted the errors are displayed on a per-field basis
3. Errors are then _frozen_ on a _per-field_ basis until the field is _blurred_
4. Once a field is _blurred_ its error is erased (**not** evaluated based on current value) 

it is fairly simple to have direct transition drivers for both value updates and
for blurs and for form submits. 

## Direct error validators

Where React Hook Forms has a variety of shorthands for validator functions, here we are
using a direct value -> message pipes; much the same effect can be managed via `yum`
or `zod`. 

Directly tooling our desired tempo is a bit more straightforward than retooling
a system to meet your standards. 

