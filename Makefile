
DIR_ROOT=.
DIR_MODULES=$(DIR_ROOT)/node_modules
DIR_TOOLBIN=$(DIR_MODULES)/.bin
TOOL_ESLINT=$(DIR_TOOLBIN)/eslint

DIR_PROJECT=$(DIR_ROOT)/PROJECT
TOOL_GEN_REPO_BUILDTAG=$(DIR_PROJECT)/generate_encapsule_build.js
TOOL_GEN_PACKAGE_MANIFEST=$(DIR_PROJECT)/generate_package_manifest.js
TOOL_GEN_PACKAGE_LICENSE=$(DIR_PROJECT)/generate_package_license.js
TOOL_GEN_PACKAGE_README=$(DIR_PROJECT)/generate_package_readme.js

DIR_SOURCES=$(DIR_ROOT)/SOURCES
DIR_SOURCES_LIB=$(DIR_SOURCES)/LIB
DIR_SOURCES_LIB_HOLISM=$(DIR_SOURCES_LIB)/holism

DIR_BUILD=$(DIR_ROOT)/BUILD
DIR_BUILD_LIB=$(DIR_BUILD)/LIB
DIR_BUILD_LIB_HOLISM=$(DIR_BUILD_LIB)/holism

DIR_BUILD_LIB_HOLISM_STAGE1=$(DIR_BUILD_LIB_HOLISM)/stage1

package_holism: repo_build_info
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM)/
	mkdir -p $(DIR_BUILD_LIB_HOLISM_STAGE1)
	cp -rv $(DIR_SOURCES_LIB_HOLISM)/* $(DIR_BUILD_LIB_HOLISM_STAGE1)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName holism > $(DIR_BUILD_LIB_HOLISM_STAGE1)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISM_STAGE1)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISM_STAGE1)

clean_build:
	rm -rfv $(DIR_BUILD)/*

repo_build_info:
	$(TOOL_GEN_REPO_BUILDTAG) > $(DIR_BUILD)/encapsule_repo_build.json
