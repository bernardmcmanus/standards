export DOCKER_REPO ?= bernardmcmanus/standards
export DOCKER_TAG  ?= latest

.DEFAULT: all

all: build test

.PHONY: build
build:
	@docker build -t $(DOCKER_REPO):$(DOCKER_TAG) .

.PHONY: test
test:
	@docker run --rm $(DOCKER_REPO):$(DOCKER_TAG) npm test

.PHONY: publish
publish:
	@docker run \
		--rm \
		-e NPM_TOKEN=$(NPM_WRITE_TOKEN) \
		$(DOCKER_REPO):$(DOCKER_TAG) \
		npm run publish
