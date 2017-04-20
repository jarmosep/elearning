## Student-centred language learning environment

### Japanese language learning environment for the use of Sendai National College of Technology and its exchange students.

##### Get started
Once you have pulled the branch to your computer, follow these steps:
1. in bash, navigate to the /elearning root
2. install bower and npm by typing in the following commands
```
bower install
npm install
```
4. in Gruntfile.js, under 'connect' - change the 'base' to match the directory where you want to locally develop.
5. in bash, set up the Grunt task by typing
```
grunt server
```
6. start developing! No XAMPP or other compilers are needed, as Grunt provides a localhost and automatic SASS/JS compiling.
