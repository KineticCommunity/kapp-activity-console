## Overview
Activity console.

## Activity Form

Build a new form and name it.

Create a new page, and set up all bridge resources you intend to use. make sure the parameter is _${values('key')}_

Create a text field with a name and label of _"key"_

Create an HTML Content containing the following code

```html
    <button class="modify btn btn-sm btn-primary dropdown-toggle" value="Modify" type="button" data-toggle="dropdown" aria-expanded="true" id="dropdownMenu1">
        Sources
        <span class="caret"></span>
    </button>
    <div class="sourcesSelector dropdown-menu" aria-labelledby="dropdownMenu1"><ul class="sourcelist"></ul></div>
    <div class="tableBody">
```


## Personalization
This bundle easily allows for minor personalization by including optional attributes in your KAPP, Form and/or Categories.

#### KAPP Attributes
* _logo-url_ : By including this attribute we will use this logo instead of the home icon on the top-left of the page
* _logo-height-px_ : By including this attribute we will set the height of the logo in the header. Default is 40px with 5px of padding.
* _sidebar-html_ : We show the Kinetic Data Twitter feed by default, but you can add any HTML/widget by including the HTML/JS in this attribute.

#### Form Attributes
* _form-icon-class_ : We include font-awesome icons by default and just apply a random icon to your forms on the catalog page.  However, you can specify a class for your form by including this attribute and a value. (Example fa-bank)

#### Category Attributes
* _hidden_ : Including this attribute on a category means the category and forms in that category will not be shown on the portal page.


## Customization
When you customize this bundle it is a good idea to fork it on your own git server to track your customizations and merge in any code changes we make to the default.

We also suggest you update this README with your own change summary for future bundle developers.

### Structure
This default bundle uses our standard directory structure.  Bundles are completely self contained so should include all libraries and markup needed.

### SearchHelper

The following two lines of code must be added to initialization.jspf
<%request.setAttribute("SearchHelper", new SearchHelper(request))%>
<%@include file="SearchHelper.jspf"%>

in your desired jsp file, call the below function, passing in the required parameters:

SearchHelper.search(Index, Results, Forms, Key Phrase).

  Index - starting index within list (int)
  Results - number of results to be returned per page (int)
  Forms - list of forms to iterate over (List<Form>)
  Key Phrase - the key phrase input (String)

The function will return any forms that contain the terms extracted from the passed in key phase.
search.json.jsp has broken into the values that will be most needed when looking for search results.

### WeightHelper

In your file add <%@include file="WeightHelper.jspf"%>
to use this helper, call WeightHelper.weight(Form source, List<String> terms)
Form source: is the form object to be iterated through
List<String> terms: is the list of terms that is to be incremented through

The weight helper will iterate over the components of the passed in form, check for each term in the List.
Then the Helper will add a weight modifier pending on which form component contained the term

<code><pre>
/*bundle-name*
  /*bundle*: Initialization scripts and helpers
  /*css*: Cascading style sheets. If you use Sass, check our the scss directory here.
  /*images*: Duh.
  /*js*: All javascript goes here.
  /*layouts*: One or more layouts wraps your views and generally includes your HTML head elements and any content that should show up on all pages.
  /*libraries*: Include CSS, JS or other libraries here including things like JQuery or bootstrap.
  /*pages*:  Individual page content views. In our example we have a profile.jsp and search.jsp.
  /*partials*: These are view snippets that get used in the top-layer JSP views. Feel free to include sub-directories here if your set of partials gets unwieldy.
  /*confirmation.jsp*: The default confirmation page on form submits.
  /*form.jsp*: The default form JSP wrapper.
  /*kapp.jsp*: This is the catalog console page or self service portal page.  This typically lists the forms by category, my requests, my approvals and more.
  /*login.jsp*: The default login page. Can be overridden in your Space Admin Console.
  /*resetPassword.jsp*: The default reset password page. This will trigger the system to send an email to the user to reset their password. Note that the SMTP server needs to be configured to work.
  /*space.jsp*: A page that displays a list of KAPPs (often request catalogs) that you have access to within your space.
</pre></code>
