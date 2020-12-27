# giftme
A place to create a list of gifts, share it with your friends and family, and find out what gifts have yet to be bought

website is live @ [here](https://giftme-8e917.web.app/)

## specs

- ability to create account, login, logout
- create a list
- create a group

## concepts

- List. a itemized list of text that describes a gift
- Group. an array of emails (registered or non registered users)

### mvp

- [x] functionality
    - [x] auth
    - [x] add text gift wish
    - [x] create groups
- [x] pages
    - [x] group wishlist view
    - [x] wishlist view
    - [x] edit wishlist view
    - [x] sign in / sign out
- [x] mobile friendly
- [ ] group feature
    - [x] cannot add duplicate groupnames
    - [x] groups should have owners
    - [ ] only owners can invite members
    - [ ] only owners can accept requests
    - [ ] only users can add themselves to groups by requesting or accepting invites
    - [ ] delete/edit groups
- [ ] cleanup
    - [x] remove border from wishlist and turn them into lists
    - [ ] add displayName, username, avatar to profile view
    - [ ] make wishlist appear a bit larger in mobile mode?
    - [ ] get rid of footer
    - [ ] give header more utility
    - [ ] make login page more appealing
    - [ ] customize theme
- [ ] various mobile bugs
    - [ ] inputs squish when keyboard appears during wishlist editing
    - [ ] was getting an odd error when trying to sign up on mobile phone
    - [x] make navbar menu stretch across width and 
    - [ ] push content down when menu is open?
- [ ] require username during sign up process
- [ ] validation
    - [ ] gift items cannot be empty
    - [ ] cannot choose username that already exists


#### feature requests

- add email/pass option for sign in
- chat room
- themes for birthdays/christmas season
- privacy settings
- claim gifts on wishlists
- give gift items properties
    - add a link
    - add an image
    - add description / instructions
- spruce up sign in page with logo

#### 📚 For Further Reading

- [help with usernames](https://fireship.io/lessons/custom-usernames-with-firebase-authentication-and-angular/)
- [info for when implementing email/pass sign in](https://stackoverflow.com/questions/44615808/firebase-detecting-if-user-exists)