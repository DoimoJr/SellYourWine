import { chromium } from 'playwright';

async function testConfirmDelivery() {
  console.log('🚀 Starting delivery confirmation test...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navigate to login
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // 2. Login as Luca Verdi (buyer)
    console.log('🔐 Logging in as Luca Verdi (buyer)...');
    await page.fill('input[name="email"]', 'luca.verdi@email.com');
    await page.fill('input[name="password"]', 'password123');

    // Click submit and wait for navigation to /browse
    await Promise.all([
      page.waitForURL('**/browse', { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);

    console.log('✅ Logged in successfully (redirected to /browse)\n');

    // 3. Navigate to orders page
    console.log('📦 Navigating to orders page...');
    await page.goto('http://localhost:3000/orders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✅ Orders page loaded\n');

    // 4. Check if we see the order in purchases tab (should be default)
    console.log('🔍 Looking for SHIPPED order in purchases tab...');

    // 5. Look for "Conferma Consegna" button
    const confirmButton = page.locator('button:has-text("Conferma Consegna")');
    const buttonCount = await confirmButton.count();

    if (buttonCount === 0) {
      console.log('❌ No "Conferma Consegna" button found!');
      console.log('📸 Taking screenshot...');
      await page.screenshot({ path: 'no-confirm-button.png', fullPage: true });

      // Check order status
      const statusBadge = page.locator('text=Spedito').first();
      if (await statusBadge.count() > 0) {
        console.log('✅ Order shows as "Spedito" (SHIPPED)');
      } else {
        console.log('❌ No SHIPPED order found');
      }

      return;
    }

    console.log(`✅ Found ${buttonCount} "Conferma Consegna" button(s)\n`);

    // 6. Click the button
    console.log('🖱️  Clicking "Conferma Consegna" button...');
    await confirmButton.first().click();

    // Wait for API call
    console.log('⏳ Waiting for confirmation...');
    await page.waitForTimeout(2000);

    // 7. Check if order status changed to DELIVERED
    const deliveredBadge = page.locator('text=Consegnato');
    const isDelivered = await deliveredBadge.count() > 0;

    if (isDelivered) {
      console.log('✅ SUCCESS! Order marked as DELIVERED\n');
      console.log('📸 Taking success screenshot...');
      await page.screenshot({ path: 'delivery-confirmed.png', fullPage: true });
    } else {
      console.log('❌ Order still not showing as DELIVERED');
      console.log('📸 Taking error screenshot...');
      await page.screenshot({ path: 'delivery-failed.png', fullPage: true });

      // Check for error messages
      const errorMessage = await page.locator('text=/error|errore|failed/i').textContent().catch(() => null);
      if (errorMessage) {
        console.log(`❌ Error message: ${errorMessage}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'test-error.png', fullPage: true });
  } finally {
    console.log('\n🏁 Test completed');
    await browser.close();
  }
}

testConfirmDelivery();
