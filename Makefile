export GIT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD 2> /dev/null)
export GIT_COMMIT ?= $(shell git rev-parse --short=7 HEAD 2> /dev/null)
export GIT_DIRTY  ?= $(shell [[ `git status --short --untracked-files=no` ]] && echo 1)

export DOCKER_BRANCH_TAG = "$(GIT_BRANCH)$(if $(GIT_DIRTY),--DIRTY)"
export DOCKER_COMMIT_TAG = "$(GIT_COMMIT)$(if $(GIT_DIRTY),--DIRTY)"
export DOCKER_IMAGE      = "bernardmcmanus/standards"

.DEFAULT: all

all: dev test release

.PHONY: dev
dev:
	@docker build \
		-t $(DOCKER_IMAGE):$(DOCKER_BRANCH_TAG) \
		-t $(DOCKER_IMAGE):$(DOCKER_COMMIT_TAG) \
		.

.PHONY: release
release:
	# noop

.PHONY: test
test:
	@docker run \
		--rm \
		$(DOCKER_IMAGE):$(DOCKER_BRANCH_TAG) \
		npm test

.PHONY: publish
publish:
	@docker run \
		--rm \
		-e NPM_TOKEN=$(NPM_WRITE_TOKEN) \
		$(DOCKER_IMAGE):$(DOCKER_BRANCH_TAG) \
		npm run publish
