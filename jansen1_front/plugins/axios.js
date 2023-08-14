export default function ({ $axios, store, redirect }) {
    // $axios.onRequest(config => {

    //     // if a branchcode is present, include it on the header for API usage
    //     if (store.state.selectedBranch) {
    //         config.headers.common['BranchCode'] = store.state.selectedBranch.branch_code
    //     }
    // })


    // put the selected_branch_code on all axios request
    if (store.state.selectedBranch) {
        // check if admin then must be "all"
        //console.log(store.state.auth)
        $axios.setHeader('XBranchCode', store.state.selectedBranch.branch_code)
    }


}