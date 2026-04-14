# Build Checklist + Definition of Done

## Whole portfolio — definition of done
A release is done when:
- the public site is live
- the repo is public and understandable
- the repo remains public-safe with no secrets, state files, `.tfvars`, or sensitive notes committed
- the main pages are complete and linked
- at least 3 demos are fully interactive
- the eval console shows live run data from the demos
- Terraform-managed deploy path works
- GitHub Actions CI passes
- the site looks intentional on desktop/tablet/mobile
- the repo shows engineering discipline, not just output

## Web app — done
- [x] Responsive nav/layout complete
- [x] Home/About/Projects/Architecture/Observability/Repo Workflow pages complete
- [x] All project detail pages complete
- [x] Demo pages navigable and polished
- [x] Error/loading/empty states handled
- [x] Mobile/tablet/desktop checked

## API — done
- [x] Health route working
- [x] Shared wrappers used consistently
- [x] Structured outputs validated
- [x] Trace logging working
- [x] Eval persistence working
- [x] Failure/fallback paths tested

## Payment Exception Review Agent — done
- [ ] Works with structured + unstructured input
- [ ] Uses tools
- [ ] Emits trace
- [ ] Can escalate
- [ ] Has project page + demo page + metrics surfaced

## Intelligent Investing Ops Copilot — done
- [ ] Uses retrieval + tools
- [ ] Cites sources
- [ ] Avoids unsafe actioning
- [ ] Emits trace
- [ ] Has project page + demo page + metrics surfaced

## Legacy AI Adapter — done
- [ ] Shows messy input normalization
- [ ] Shows deterministic validation
- [ ] Shows transformed legacy payload
- [ ] Shows failure case
- [ ] Has project page + demo page + metrics surfaced

## Eval Console — done
- [ ] Run table works
- [ ] Charts work
- [ ] Filters work
- [ ] Bad runs are visible
- [ ] Prompt version or run comparison exists

## Terraform / CI/CD — done
- [x] Terraform fmt/validate pass
- [x] Deploy path automated
- [x] Secrets not hardcoded
- [x] Ignore files reviewed for env files, Terraform state/plans, `.tfvars`, service-account keys, and deployment artifacts
- [ ] GitHub Actions badges present
- [x] OIDC-based auth working or clearly staged next

## Documentation — done
- [x] README explains repo fast
- [x] PRD and specs exist
- [x] Infra docs exist
- [x] Project docs exist
- [x] Architecture diagrams exist
