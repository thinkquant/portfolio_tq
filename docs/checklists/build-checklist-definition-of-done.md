# Build Checklist + Definition of Done

## Whole portfolio — definition of done
A release is done when:
- the public site is live
- the repo is public and understandable
- the main pages are complete and linked
- at least 3 demos are fully interactive
- the eval console shows live run data from the demos
- Terraform-managed deploy path works
- GitHub Actions CI passes
- the site looks intentional on desktop/tablet/mobile
- the repo shows engineering discipline, not just output

## Web app — done
- [ ] Responsive nav/layout complete
- [ ] Home/About/Projects/Architecture/Observability/Repo Workflow pages complete
- [ ] All project detail pages complete
- [ ] Demo pages navigable and polished
- [ ] Error/loading/empty states handled
- [ ] Mobile/tablet/desktop checked

## API — done
- [ ] Health route working
- [ ] Shared wrappers used consistently
- [ ] Structured outputs validated
- [ ] Trace logging working
- [ ] Eval persistence working
- [ ] Failure/fallback paths tested

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
- [ ] Terraform fmt/validate pass
- [ ] Deploy path automated
- [ ] Secrets not hardcoded
- [ ] GitHub Actions badges present
- [ ] OIDC-based auth working or clearly staged next

## Documentation — done
- [ ] README explains repo fast
- [ ] PRD and specs exist
- [ ] Infra docs exist
- [ ] Project docs exist
- [ ] Architecture diagrams exist
