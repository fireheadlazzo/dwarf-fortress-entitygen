//
// Contains the generic getName function for getting the name of a civ entity. 
// Not suitable for FBs or artifacts except in special cases.
//

// getName() //Should take in a language and a word pool. Outputs a standard name in the given language using the given pool

// wordIsOfType() //Grammar checking function. Checks to see that a given word has a given form

  export function wordIsOfType(word, type) {
    // Take the word, retrieve the array of types from the grammar blob, and check to see if it can be considered "type"
    if (word) {
      let typeArray = this.props.grammar[word];
      return typeArray.includes(type);
    } else return true;
  }

  export const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  export function deaccent(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  export function buildNamePool() {
    let newPool = [];
    if (this.state.selectedCurrent === this.state.selectedPrev) {
      console.log("Same as last set!");
      return;
    }
    // If the pool options have changed since last time, rebuild the pool from scratch using the first part of the pool options
    // If the selectedCurrent[0] array is empty, the user has not selected any tags to be applied. Add all available names to the pool
    if (this.state.selectedCurrent[0].length > 0) {
      // add only the activated names to the pool
      for (let i = 0; i < this.state.selectedCurrent[0].length; i++) {
        newPool = newPool.concat(
          this.props.tokens[this.state.selectedCurrent[0][i]]
        );
      }
    } else {
      // add all available names to the pool
      for (let i = 0; i < this.state.allNameTokens.length; i++) {
        newPool = newPool.concat(
          this.props.tokens[this.state.allNameTokens[i]]
        );
      }
    }

    console.log("newPool", newPool);
    newPool = newPool.filter((e, i, self) => e !== "" && i === self.indexOf(e));

    // filtering out forbidden words (passing in the standard set of forbidden dwarf names)
    newPool = this.cullForbiddenNames(newPool, this.state.selectedCurrent[1]);
    
    //update the previous pool so that rapid queries can be faster
    this.setState({ selectedPrev: this.state.selectedCurrent });
    // put the new pool of names on state for easy access
    this.setState({ namePool: newPool });
    return newPool;
  }

  export function getName(pool = []) { //change to getEntityName()
    // To get a name, choose from the pool of names. The pool should already be filtered to include all relevant spheres
    let first, last1, last2;  

    //TODO: Program crashes if the resulting pool of names is empty. Check for this.
    do {
      first = pool[Math.floor(Math.random() * pool.length)];
    } while (!wordIsOfType(first, "noun"));
    last1 = pool[Math.floor(Math.random() * pool.length)];
    last2 = pool[Math.floor(Math.random() * pool.length)];

    let dwarfName = {
      //set new names only if the user has not opted to hold the name
      ...this.state.currentEntity,
      firstName: this.state.currentEntity.firstNameHeld === true
        ? this.state.currentEntity.firstName
        : capitalize(
            this.props[this.state.selectedLanguage][this.props.english.indexOf(first)]
          ),
      lastName: this.state.currentEntity.lastNameHeld === true
        ? this.state.currentEntity.lastName
        : capitalize(
            this.props[this.state.selectedLanguage][this.props.english.indexOf(last1)] +
              this.props[this.state.selectedLanguage][this.props.english.indexOf(last2)]
          ),
      transLastName: this.state.currentEntity.lastNameHeld === true
      ? this.state.currentEntity.transLastName
      : capitalize(last1) + "-" + capitalize(last2)
    };
    this.setState({
      currentEntity: dwarfName,
      namesThisSession: this.state.namesThisSession + 1
    });
  }