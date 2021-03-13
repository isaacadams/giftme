# giftme
A place to create a list of gifts, share it with your friends and family, and find out what gifts have yet to be bought

website is live @ [here](https://giftme.isaacadams.me)

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
    - [x] only owners can invite members
        - [x] new invites go to existing users/$uid 
        - [x] users can accept/reject invites
    - [x] delete groups
    - [x] only owner can see controls
    - [ ] edit group displayname and username
    - [ ] control for displaying a wishlist
    - [ ] group home page ideas
        - header nav bar which only shows for owner/admin with Home & Settings
        - list of users in group displays below group display name and groupname
        - can select one or multiple users in list to display the wishlists in the adjacent area
        - owner/admin can select settings to reveal edit group/manage users options
- [ ] cleanup
    - [x] remove border from wishlist and turn them into lists
    - [x] add displayName, username
    - [ ] add avatar to profile view
    - [ ] make wishlist appear a bit larger in mobile mode?
    - [ ] get rid of footer
    - [ ] give header more utility
    - [ ] make login page more appealing
    - [ ] customize theme
    - [ ] use responsive grid to help with height issues in mobile view
- [ ] various mobile bugs
    - [ ] inputs squish when keyboard appears during wishlist editing
    - [ ] was getting an odd error when trying to sign up on mobile phone
    - [x] make navbar menu stretch across width and 
    - [ ] push content down when menu is open?
- [x] require username during sign up process
- [ ] validation
    - [ ] gift items cannot be empty
    - [x] cannot choose username that already exists


#### feature requests

- add email/pass option for sign in
- claim gifts on wishlists
- give gift items properties
    - add a link
    - add an image
    - add description / instructions
- spruce up sign in page with logo
- filter users in `Manage members` list using search bar
- [ ] invite people to groups using an email
    - if an email associated with no existing users, then it goes to potentialusers/$email?
- [ ] group requests 
    - users can request to be in a group
    - only owners can accept requests
- privacy settings
- chat room
- themes for birthdays/christmas season

#### 📚 For Further Reading

- [help with usernames](https://fireship.io/lessons/custom-usernames-with-firebase-authentication-and-angular/)
- [info for when implementing email/pass sign in](https://stackoverflow.com/questions/44615808/firebase-detecting-if-user-exists)