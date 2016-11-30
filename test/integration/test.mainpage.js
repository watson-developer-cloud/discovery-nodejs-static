/* eslint no-undef: 0 */
/* eslint prefer-arrow-callback: 0 */
casper.test.begin('Discovery Demo', 8, function suite(test) {
  const baseHost = 'http://localhost:3000';

  function testForButtons() {
    casper.waitForSelector('div.input--data-selection', function runAfterWaiting() {
      test.assertExists('input[type=radio]#input-name-0', 'button 0');
      test.assertExists('input[type=radio]#input-name-1', 'button 1');
      test.assertExists('input[type=radio]#input-name-2', 'button 2');
      test.assertExists('input[type=radio]#input-name-3', 'button 3');
      test.assertExists('input[type=radio]#input-name-4', 'button 4');
      test.assertExists('input[type=radio]#input-name-5', 'button 5');
    });
  }

  casper.start(baseHost, function runAfterStart(result) {
    test.assert(result.status === 200, 'Front page opens');
    test.assertEquals(this.getTitle(), 'Discovery Demo', 'Title is found');
    testForButtons();
  });

  casper.run(function runAfterRun() {
    test.done();
  });
});
