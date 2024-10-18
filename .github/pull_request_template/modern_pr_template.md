### PR Summary
<!-- Clearly explain the purpose of this Pull Request. -->

### Related Issues
<!-- List any related issues or tickets here. -->

### How to Review This PR
<!-- Give any special instructions for reviewing the changes, such as specific files to focus on or tests to run. -->

---

### Does This PR Introduce Breaking Changes? (yes/no)
<!-- If yes, describe the impact and the steps necessary for others to migrate. -->

### Checklist
#### General Checklist
- [ ] Did you update the version?
- [ ] Have you checked this change doesn't break any contract? If so, did you inform consumers?
- [ ] Is it covered with Unit Tests?
- [ ] Is it covered with Acceptance Tests?
- [ ] Are there Prometheus metrics?
- [ ] Did you update the Swagger documentation?
- [ ] Are there no commented-out or debug code left? (If necessary, use `// FIXME` or `// TODO` with a follow-up task.)

---

#### **Infrastructure PRs**
<details>
<summary>Expand if this PR affects infrastructure (Terraform, Kubernetes, etc.)</summary>

- [ ] Have you added the `PR plan` label?
- [ ] After confirming the plan is correct, have you added the `PR apply` label?

</details>

---

#### **Publishing Python Packages**
<details>
<summary>Expand if this PR affects a Python package (setup.py or pyproject.toml)</summary>

- [ ] Have you added the `python publish` label?
- [ ] Have you incremented the package version appropriately?

</details>
