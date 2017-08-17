    var test = require('unit.js');
    var SpiraReporter = require('../reporter/SpiraReporter.js');
    describe('Example Test', function(){
      it('sample pass', function(){
        // just for example of tested value
        var example = 'hello world';
        test
          .string(example)
            .startsWith('hello')
            .match(/[a-z]/)
          .given(example = 'you are welcome')
            .string(example)
              .endsWith('welcome')
              .contains('you')
          .when('"example" becomes an object', function(){
            example = {
              message: 'hello world',
              name: 'Nico',
              job: 'developper',
              from: 'France'
            };
          })
          .then('test the "example" object', function(){
            test
              .object(example)
                .hasValue('developper')
                .hasProperty('name')
                .hasProperty('from', 'France')
                .contains({message: 'hello world'})
            ;
          })
          .if(example = 'bad value')
            .error(function(){
              example.badMethod();
            })
        ;
      });
      it('sample fail', function(){
        // just for example of tested value
        var example = 'not hello world';
        test
          .string(example)
            .startsWith('hello')
            .match(/[a-z]/)
          .given(example = 'you are welcome')
            .string(example)
              .endsWith('welcome')
              .contains('you')
          .when('"example" becomes an object', function(){
            example = {
              message: 'hello world',
              name: 'Nico',
              job: 'developper',
              from: 'France'
            };
          })
          .then('test the "example" object', function(){
            test
              .object(example)
                .hasValue('developper')
                .hasProperty('name')
                .hasProperty('from', 'France')
                .contains({message: 'hello world'})
            ;
          })
          .if(example = 'bad value')
            .error(function(){
              example.badMethod();
            })
        ;
      });
    });