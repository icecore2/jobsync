import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("localhost:3000");
  await page.getByPlaceholder("id@example.com").click();
  await page.getByPlaceholder("id@example.com").fill("admin@example.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("http://localhost:3000/dashboard");
});

test.describe("Profile page", () => {
  test("should create a new resume", async ({ page }) => {
    await page.getByRole("link", { name: "Profile" }).click();

    await page.getByRole("button", { name: "Create Resume" }).click();
    await page
      .getByPlaceholder("Ex: Full Stack Developer")
      .fill("Test Resume 1");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("status")).toHaveText(
      /Resume title has been created/
    );
    await expect(page.locator("tbody")).toContainText("Test Resume 1");
  });

  test("should edit the resume title", async ({ page }) => {
    await page.getByRole("link", { name: "Profile" }).click();
    await page.getByTestId("resume-actions-menu-btn").first().click();
    await page.getByRole("menuitem", { name: "Edit Resume Title" }).click();
    await page
      .getByPlaceholder("Ex: Full Stack Developer")
      .fill("Test Resume 1 edited");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("status")).toHaveText(
      /Resume title has been updated/
    );
    await expect(page.locator("tbody")).toContainText("Test Resume 1 edited");
  });
  test("should delete a resume", async ({ page }) => {
    await page.getByRole("link", { name: "Profile" }).click();
    await page.getByTestId("resume-actions-menu-btn").first().click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await expect(page.getByRole("alertdialog")).toContainText(
      "Are you sure you want to delete this resume?"
    );
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByRole("status").first()).toContainText(
      /Resume has been deleted successfully/
    );
    await expect(page.locator("tbody")).not.toContainText(
      "Test Resume 1 edited"
    );
  });
});
