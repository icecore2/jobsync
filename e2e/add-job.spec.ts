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

test.describe("Add New Job", () => {
  const jobText = "developer test title";
  test("should allow me to add a new job", async ({ page }) => {
    await page.getByRole("button", { name: "Add New Job" }).click();
    await expect(page).toHaveURL("http://localhost:3000/dashboard/myjobs");

    await page.getByTestId("add-job-btn").click();
    await expect(page.getByTestId("add-job-dialog-title")).toBeVisible();
    await page
      .getByPlaceholder("Copy and paste job link here")
      .fill("www.google.com");
    await page.getByLabel("Job Title").click();
    await page.getByPlaceholder("Create or Search title").click();
    await page.getByPlaceholder("Create or Search title").fill(jobText);
    const jobTitle = page.getByRole("option", {
      name: jobText,
      exact: true,
    });
    if (await jobTitle.isVisible()) {
      await jobTitle.click();
    } else {
      await page.getByText(jobText).click();
    }
    await expect(page.getByLabel("Job Title")).toContainText(jobText);
    await page.getByLabel("Company").click();
    await page.getByPlaceholder("Create or Search company").click();
    const companyText = "company test";
    await page.getByPlaceholder("Create or Search company").fill(companyText);
    const companyTitle = page.getByRole("option", {
      name: companyText,
      exact: true,
    });
    if (await companyTitle.isVisible()) {
      await companyTitle.click();
    } else {
      await page.getByText(companyText).click();
    }
    await expect(page.getByLabel("Company")).toContainText(companyText);
    await page.getByLabel("Job Location").click();
    await page.getByPlaceholder("Create or Search location").click();
    const locationText = "location test";
    await page.getByPlaceholder("Create or Search location").fill(locationText);
    const locationTitle = page.getByRole("option", {
      name: locationText,
      exact: true,
    });
    if (await locationTitle.isVisible()) {
      await locationTitle.click();
    } else {
      await page.getByText(locationText).click();
    }
    await expect(page.getByLabel("Job Location")).toContainText(locationText);
    await page.getByText("Part-time").click();
    await page.getByLabel("Job Source").click();
    await page.getByRole("option", { name: "Indeed" }).click();
    await expect(page.getByLabel("Job Source")).toContainText("Indeed");
    await page.getByLabel("Due Date").click();
    await page.getByRole("gridcell", { name: "25" }).click();
    await expect(page.getByLabel("Due Date")).toContainText("Jul 25, 2024");
    await page.getByLabel("Job Description").locator("div").click();
    await page
      .getByLabel("Job Description")
      .locator("div")
      .fill("test description");
    await page.getByTestId("save-job-btn").click();
    await expect(
      page.getByRole("cell", { name: jobText, exact: true }).first()
    ).toBeVisible();
  });

  test("should edit the job created", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/myjobs");
    await expect(
      page.getByRole("cell", { name: jobText, exact: true }).first()
    ).toBeVisible();
    await page
      .getByRole("row", { name: jobText })
      .getByTestId("job-actions-menu-btn")
      .click();
    await page.getByRole("menuitem", { name: "Edit Job" }).click();
    await expect(
      page.getByPlaceholder("Copy and paste job link here")
    ).toHaveValue("www.google.com");
    await expect(page.getByLabel("Job Title")).toContainText(
      "developer test title"
    );
    await expect(page.getByLabel("Company")).toContainText("company test");
    await expect(page.getByLabel("Job Location")).toContainText(
      "location test"
    );
    await expect(page.getByLabel("Job Source")).toContainText("Indeed");
    await expect(page.getByLabel("Select Job Status")).toContainText("Draft");
    await expect(page.getByLabel("Due Date")).toContainText("Jul 25, 2024");
    await expect(page.getByRole("paragraph")).toContainText("test description");
    await page.getByText("test description").click();
    await page
      .getByLabel("Job Description")
      .locator("div")
      .fill("test description edited");
    await page.getByTestId("save-job-btn").click();
    await expect(page.getByText("Job has been updated")).toBeVisible();
  });

  test("should delete the job created", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/myjobs");
    await expect(
      page.getByRole("cell", { name: jobText, exact: true }).first()
    ).toBeVisible();
    await page
      .getByRole("row", { name: jobText })
      .getByTestId("job-actions-menu-btn")
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
  });
});
