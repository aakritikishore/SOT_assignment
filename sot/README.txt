Search Operation

->Filter is selected SELECT ALL as default
->Search can be done by using First name, Last name, Email
->On clicking SEARCH button, API call is made using GET method and loading image is shown along with loading percent and loading messages which are changing dynamically.
->After loading percent reached 100%, all the Employee data is shown is a responsive table.

ADD Operation

->On clicking ADD EMPLOYEE, a form will be open, user can fill it and submit. All the feilds are mandatory.
->After that JQuery Valiadation is done.
->If valiadtaed, form will be submitted using POST method.

Edit operation

->When clicking on Edit button, API call is made with GET method to get existing data in modal form of that particular id to be edited.
->User can edit form and click submit. On clicking submit button, API call i smade using PUT method.
->Also the edited row in table get updated without refreshing entire page.


DELETE Operation

->User can delete data from API, using DELETE button.
->On clicking delte button for a particular Employee, API call is made using DELETE method.
->The deleted row will be hidden to avoid full refresh. 

CSS : Mostly Bootstrap 3.3.7 classes is used. Also custom css is used for Employee Data table.

JQuery: version used is JQuery 3.3.1