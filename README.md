# AnAccordion
A simple accordion library

## ReadMe contents
1. Quick Usage
2. Change Logs
3. Upcoming Changes
4. Known Bugs

## 1. Quick Usage Guide
AnAccordion.js is a standalone JS library. No other dependancies required.
There are only 2 files required:
1. AnAccordion.js (Minified version will be available soon)
2. AnAccordion.css (Coming soon - Currently css is available in the HTML file)

### HTML Structure
Base structure

    .accordion
      |_ .accordion__group
        |_ .accordion__group__head
          |_ .accordion__group__body

This is the structure for an accordion with 2 tabs

    <div id="myAccordion" class="accordion">
      <div class="accordion__group">
        <div class="accordion__group__head">Accordion Head 1</div>
          <div class="accordion__group__body">
              <div>
                  Accordion Content 1
              </div>
          </div>
        </div>
        <div class="accordion__group">
            <div class="accordion__group__head">Accordion Head 2</div>
            <div class="accordion__group__body">
                <div>
                    Accordion Content 2
                </div>
            </div>
        </div>
    </div>


### JavaScript
Ensure AnAccordion.js only runs after DOM content is loaded.
You can instantiate accordions as such

```const newAccordion = Accordion(selector, options)```

In the case for our our accordion HTML above, this will be the way to instantiate it
```const newAccordion = Accordion('#myAccordion', {});```

### Options
Options are JSON structures that defines the accordion's behaviour. Any options not defined by the user will use the default options.

#### Available options
1. allowMultiReveal(boolean) - If set to true, allows more than 1 tab to be opened without closing the others
2. transitionTime(number) - Specifies time taken (in ms) for tabs to open and close
3. queueTransition(boolean) - If set to true, tabs will wait for any opened tab in the same accordion to close before opening

#### Default option values
1. allowMultiReveal - false
2. transitionTime - 200
3. queueTransition - true

#### Specifying options
As mentioned, options are written in JSON. So following our example above, if we'd like to change the transition time to 1s and allow multiple tabs to be opened, the accordion will be instantiated this way

      const newAccordion = Accordion('#myAccordion', {
        allowMultiReveal: true,
        transitionTime: 1000
      });
      
### Multiple Accordions
If multiple accordions are desired with the same options, you can instantiate them this way:

#### HTML
This is the structure for an accordion with 2 tabs

    <div class="same-accordions accordion">
      <div class="accordion__group">
        <div class="accordion__group__head">Accordion 1 Head 1</div>
          <div class="accordion__group__body">
              <div>
                  Accordion 1 Content 1
              </div>
          </div>
        </div>
    </div>

    <div class="same-accordions accordion">
      <div class="accordion__group">
        <div class="accordion__group__head">Accordion 2 Head 1</div>
          <div class="accordion__group__body">
              <div>
                  Accordion 2 Content 1
              </div>
          </div>
        </div>
        <div class="accordion__group">
            <div class="accordion__group__head">Accordion 2 Head 2</div>
            <div class="accordion__group__body">
                <div>
                    Accordion 2 Content 2
                </div>
            </div>
        </div>
    </div>

#### JavaScript
Currently in version 1, the shortest way to do this is to select all the accordions by their selector first and loop through each one.
``` document.querySelectorAll('.same-accordions').forEach(el => { Accordion('.same-accordions', {transitionTime: 500}) })```


## Change Logs
### Ver 1.0.0
There's really nothing for now until the next version

## Upcoming Changes

### Non breaking
1. Create AnAccordion.css
2. Minify JS and CSS into \_dist folder
3. Add a blocker so user can't click while transition is playing

### Breaking
1. Enable passing HTML object into Accordion() function. This is so that we can pass the object itself into the function instead of selector, which makes it nicer for instantiating multiple accordions

## Known Bugs

### High Priority Bugs
1. Currently tab__group__body height do not display correctly if there is a padding-top and padding-bottom unless screen is resized.
When setBodyHeight method is called during initGroup, the getComputedStyle function is not returning padding-top. There is a workaround for this by adjusting padding in playAnimation() function but this would mean adding stylistic behaviour into the JS.
