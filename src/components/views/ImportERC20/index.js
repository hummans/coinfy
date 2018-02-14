import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { generateQRCode } from '/api/qr'
import { Coins } from '/api/Coins'
import { isAddress } from '/api/Coins/ETH'
import routes from '/const/routes'
import state from '/store/state'

import styles from '/const/styles'

import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import Div from '/components/styled/Div'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Select from '/components/styled/Select'
import { Label, SubLabel } from '/components/styled/Label'
import CenterElement from '/components/styled/CenterElement'
import IconHeader from '/components/styled/IconHeader'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'
// import ImportEthereum from '/components/views/ImportERC20/ImportEthereum'
import ImportAddress from '/components/views/ImportBTC/ImportAddress'
import ImportPrivate from '/components/views/ImportBTC/ImportPrivate'
import ImportKeystore from '/components/views/ImportETH/ImportKeystore'

const TYPES_IMPORT = {
    // ethereum: 0,
    address: 1,
    private: 2,
    keystore: 3
}

export default class ImportERC20 extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        this.Coin = Coins[state.location.path[state.location.path.length - 1]]

        // Initial state
        state.view = {
            type_import: TYPES_IMPORT.address,
            address: ''
        }

        // binding
        this.onChangeTypeImport = this.onChangeTypeImport.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    // Actions
    onChangeTypeImport(e) {
        const collector = collect()
        state.view.address = ''
        state.view.type_import = Number(e.target.value)
        collector.emit()
    }

    render() {
        const isValidAddress = isAddress(state.view.address)
        return React.createElement(ImportTemplate, {
            type_import: state.view.type_import,
            address: state.view.address,
            Coin: this.Coin,
            isValidAddress: isValidAddress,
            qrcodebase64: isValidAddress
                ? generateQRCode(state.view.address)
                : '',
            onChangeTypeImport: this.onChangeTypeImport
        })
    }
}

function ImportTemplate({
    type_import,
    address,
    Coin,
    isValidAddress,
    qrcodebase64,
    onChangeTypeImport
}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <IconHeader>
                    <img src={`/static/image/coins/${Coin.symbol}.svg`} />
                </IconHeader>
                <Div float="left">
                    <H1>{Coin.name}</H1>
                    <H2>Import {Coin.symbol} token</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <FormField>
                    <Div>
                        <QRCode>
                            <Show if={isValidAddress}>
                                <img width="150" src={qrcodebase64} />
                            </Show>
                        </QRCode>
                    </Div>
                    <Div>
                        <Address>{address}</Address>
                    </Div>
                </FormField>

                <form>
                    <FormField>
                        <FormFieldLeft>
                            <Label>I have my</Label>
                            <SubLabel>
                                Select the option you prefer to import.
                            </SubLabel>
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Select width="100%" onChange={onChangeTypeImport}>
                                {/* <option
                                    value={TYPES_IMPORT.ethereum}
                                    selected={
                                        type_import === TYPES_IMPORT.ethereum
                                    }
                                >
                                    Ethereum wallet
                                </option> */}
                                <option
                                    value={TYPES_IMPORT.address}
                                    selected={
                                        type_import === TYPES_IMPORT.address
                                    }
                                >
                                    Address
                                </option>
                                <option
                                    value={TYPES_IMPORT.private}
                                    selected={
                                        type_import === TYPES_IMPORT.private
                                    }
                                >
                                    Private key
                                </option>
                                <option
                                    value={TYPES_IMPORT.keystore}
                                    selected={
                                        type_import === TYPES_IMPORT.keystore
                                    }
                                >
                                    Keystore file (UTC / JSON)
                                </option>
                            </Select>
                        </FormFieldRight>
                    </FormField>

                    <Router>
                        {/* <Route if={type_import === TYPES_IMPORT.ethereum}>
                            <ImportEthereum />
                        </Route> */}
                        <Route if={type_import === TYPES_IMPORT.address}>
                            <ImportAddress />
                        </Route>
                        <Route if={type_import === TYPES_IMPORT.private}>
                            <ImportPrivate />
                        </Route>
                        <Route if={type_import === TYPES_IMPORT.keystore}>
                            <ImportKeystore />
                        </Route>
                    </Router>

                    <Div clear="both" />
                </form>
            </RightContent>
        </RightContainerPadding>
    )
}
