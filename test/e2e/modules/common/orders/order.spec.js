describe('WIP e2e testing', function () {

    describe(' accounts list', function () {
        var accountsList;

        beforeEach(function () {
            browser.get('http://localhost:63342/WIP/app/index.html');
        });

        it('should filter by accountname nr results is 2', function () {
            element(by.model('accountName')).sendKeys('ha');
            accountsList = element.all(by.repeater('account in $parent.filtered'));
            expect(accountsList.count()).toEqual(2);
        });

        it('should filter by adviser nr results is 1', function () {
            element(by.model('accountName')).sendKeys('bbb');
            accountsList = element.all(by.repeater('account in $parent.filtered'));
            expect(accountsList.count()).toEqual(1);
        });


    });
});

//it('should add a todo', function() {
//    var addTodo = element(by.model('todoList.todoText'));
//    var addButton = element(by.css('[value="add"]'));
//
//    addTodo.sendKeys('write a protractor test');
//    addButton.click();
//
//    expect(todoList.count()).toEqual(3);
//    expect(todoList.get(2).getText()).toEqual('write a protractor test');
//});


//xit('should greet the named user', function() {
//    browser.get('http://localhost:63342/WIP/app/index.html');
//    //var greeting = element(by.binding('yourName'));
//    //
//    //expect(greeting.getText()).toEqual('Hello Julsaddbsaie!');
//});
